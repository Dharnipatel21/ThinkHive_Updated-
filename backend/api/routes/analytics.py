# backend/api/routes/analytics.py
"""
Knowledge Analytics Dashboard — Query analytics, most searched topics,
document usage analytics, user activity tracking, and knowledge trends.

Gating: every route here requires the "analytics:read" permission. That
string is deliberately NOT listed anywhere in rbac/permissions.py's
ROLE_PERMISSIONS for manager / employee / guest / custom — only
ORG_SUPER_ADMIN's wildcard "*" satisfies it. So by construction, only
super admins can ever pass require_permission("analytics:read"), without
needing an explicit role check in every handler. (A super admin could
still hand this permission to a CUSTOM-role user via the Admin > Users
permission editor — that's an intentional escape hatch, not a bug.)
"""
from __future__ import annotations

from collections import Counter
from datetime import UTC, datetime, timedelta

from bson import ObjectId
from fastapi import APIRouter, Depends, Query

from api.dependencies.check_permissions import require_permission
from api.dependencies.get_database import DatabaseDependency
from core.context import TenantContext

router = APIRouter(prefix="/analytics", tags=["analytics"])

_REQUIRE = require_permission("analytics:read")


def _day_key(dt: datetime) -> str:
    return dt.strftime("%Y-%m-%d")


def _date_series(days: int) -> list[str]:
    now = datetime.now(UTC)
    return [_day_key(now - timedelta(days=i)) for i in range(days, -1, -1)]


@router.get("/overview")
async def overview(
    db: DatabaseDependency,
    context: TenantContext = Depends(_REQUIRE),
) -> dict:
    org_id = context.org_id
    now = datetime.now(UTC)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = today_start - timedelta(days=7)

    total_queries = await db["audit_logs"].count_documents({"org_id": org_id})
    queries_today = await db["audit_logs"].count_documents(
        {"org_id": org_id, "created_at": {"$gte": today_start}}
    )
    queries_this_week = await db["audit_logs"].count_documents(
        {"org_id": org_id, "created_at": {"$gte": week_start}}
    )
    contradiction_count = await db["audit_logs"].count_documents(
        {"org_id": org_id, "contradiction_flag": True}
    )

    recent_logs = await db["audit_logs"].find(
        {"org_id": org_id}, {"confidence": 1}
    ).sort("created_at", -1).limit(500).to_list(500)
    avg_confidence = (
        round(sum(l.get("confidence", 0) for l in recent_logs) / len(recent_logs), 3)
        if recent_logs else 0.0
    )

    active_user_ids = await db["audit_logs"].distinct(
        "user_id", {"org_id": org_id, "created_at": {"$gte": week_start}}
    )
    total_documents = await db["documents"].count_documents(
        {"org_id": org_id, "status": {"$ne": "deleted"}}
    )
    total_members = await db["users"].count_documents({"org_id": org_id})

    return {
        "total_queries": total_queries,
        "queries_today": queries_today,
        "queries_this_week": queries_this_week,
        "avg_confidence": avg_confidence,
        "contradiction_count": contradiction_count,
        "active_users_this_week": len(active_user_ids),
        "total_documents": total_documents,
        "total_members": total_members,
    }


@router.get("/query-trends")
async def query_trends(
    db: DatabaseDependency,
    context: TenantContext = Depends(_REQUIRE),
    days: int = Query(default=14, ge=1, le=90),
) -> dict:
    since = datetime.now(UTC) - timedelta(days=days)
    logs = await db["audit_logs"].find(
        {"org_id": context.org_id, "created_at": {"$gte": since}},
        {"created_at": 1},
    ).to_list(length=None)

    counts: Counter[str] = Counter()
    for l in logs:
        created = l.get("created_at")
        if created:
            counts[_day_key(created)] += 1

    series = [{"date": d, "count": counts.get(d, 0)} for d in _date_series(days)]
    return {"series": series}


@router.get("/top-topics")
async def top_topics(
    db: DatabaseDependency,
    context: TenantContext = Depends(_REQUIRE),
    limit: int = Query(default=10, ge=1, le=50),
) -> dict:
    logs = await db["audit_logs"].find(
        {"org_id": context.org_id}, {"query": 1}
    ).to_list(length=None)

    normalized: Counter[str] = Counter()
    display: dict[str, str] = {}
    for l in logs:
        q = (l.get("query") or "").strip()
        if not q:
            continue
        key = q.lower()
        normalized[key] += 1
        display.setdefault(key, q)

    top = normalized.most_common(limit)
    return {"topics": [{"query": display[k], "count": c} for k, c in top]}


@router.get("/document-usage")
async def document_usage(
    db: DatabaseDependency,
    context: TenantContext = Depends(_REQUIRE),
    limit: int = Query(default=10, ge=1, le=50),
) -> dict:
    """
    Derived from audit_logs[].sources (the citations each RAG answer actually
    used), not documents.query_count — that field is initialized to 0 on
    upload but never incremented elsewhere in the codebase, so it would
    always read zero. Counting real citations is the accurate signal.
    """
    logs = await db["audit_logs"].find(
        {"org_id": context.org_id}, {"sources": 1}
    ).to_list(length=None)

    counts: Counter[str] = Counter()
    names: dict[str, str] = {}
    for l in logs:
        seen_in_this_log: set[str] = set()
        for s in (l.get("sources") or []):
            doc_id = s.get("document_id")
            if not doc_id or doc_id in seen_in_this_log:
                continue
            seen_in_this_log.add(doc_id)
            counts[doc_id] += 1
            if s.get("document_name"):
                names[doc_id] = s["document_name"]

    top = counts.most_common(limit)
    return {
        "documents": [
            {"document_id": doc_id, "document_name": names.get(doc_id, "Unknown document"), "times_referenced": c}
            for doc_id, c in top
        ]
    }


@router.get("/user-activity")
async def user_activity(
    db: DatabaseDependency,
    context: TenantContext = Depends(_REQUIRE),
    limit: int = Query(default=10, ge=1, le=50),
) -> dict:
    logs = await db["audit_logs"].find(
        {"org_id": context.org_id}, {"user_id": 1, "created_at": 1}
    ).to_list(length=None)

    counts: Counter[str] = Counter()
    last_active: dict[str, datetime] = {}
    for l in logs:
        uid = l.get("user_id")
        if not uid:
            continue
        counts[uid] += 1
        created = l.get("created_at")
        if created and (uid not in last_active or created > last_active[uid]):
            last_active[uid] = created

    top = counts.most_common(limit)
    result = []
    for uid, c in top:
        user = None
        try:
            user = await db["users"].find_one({"_id": ObjectId(uid), "org_id": context.org_id})
        except Exception:
            pass
        result.append({
            "user_id": uid,
            "full_name": user.get("full_name") if user else "Unknown user",
            "email": user.get("email") if user else "",
            "role": user.get("role") if user else "",
            "query_count": c,
            "last_active": last_active.get(uid),
        })

    return {"users": result}


@router.get("/confidence-trends")
async def confidence_trends(
    db: DatabaseDependency,
    context: TenantContext = Depends(_REQUIRE),
    days: int = Query(default=14, ge=1, le=90),
) -> dict:
    """Knowledge trends: daily split of answer confidence (high/medium/low)."""
    since = datetime.now(UTC) - timedelta(days=days)
    logs = await db["audit_logs"].find(
        {"org_id": context.org_id, "created_at": {"$gte": since}},
        {"created_at": 1, "confidence_label": 1},
    ).to_list(length=None)

    buckets: dict[str, dict[str, int]] = {}
    for l in logs:
        created = l.get("created_at")
        if not created:
            continue
        key = _day_key(created)
        b = buckets.setdefault(key, {"high": 0, "medium": 0, "low": 0})
        label = l.get("confidence_label", "low")
        if label in b:
            b[label] += 1

    series = []
    for d in _date_series(days):
        b = buckets.get(d, {"high": 0, "medium": 0, "low": 0})
        series.append({"date": d, **b})

    return {"series": series}
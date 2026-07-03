from fastapi import APIRouter, Depends
from api.dependencies.check_permissions import require_permission
from api.dependencies.get_database import DatabaseDependency
from core.context import TenantContext

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/metrics")
async def metrics(db: DatabaseDependency, context: TenantContext = Depends(require_permission("documents:read"))) -> dict:
    docs = await db["documents"].count_documents({"org_id": context.org_id, "status": {"$ne": "deleted"}})
    ready = await db["documents"].count_documents({"org_id": context.org_id, "status": "ready"})
    queries = await db["audit_logs"].count_documents({"org_id": context.org_id})
    logs = await db["audit_logs"].find({"org_id": context.org_id}).limit(100).to_list(100)
    avg_conf = sum(l.get("confidence", 0) for l in logs) / len(logs) if logs else 0
    members = await db["users"].count_documents({"org_id": context.org_id})
    domains = await db["domains"].count_documents({"org_id": context.org_id})
    return {"total_documents": docs, "indexed_documents": ready, "total_queries": queries,
            "avg_confidence": round(avg_conf, 3), "total_members": members, "total_domains": domains}

@router.get("/knowledge-map")
async def knowledge_map(db: DatabaseDependency, context: TenantContext = Depends(require_permission("documents:read"))) -> dict:
    docs = await db["documents"].find({"org_id": context.org_id, "status": "ready"}).limit(50).to_list(50)
    nodes = [{"id": str(d["_id"]), "label": d.get("filename",""), "weight": d.get("document_weight",1.0),
               "usage_tag": d.get("usage_tag","unused"), "query_count": d.get("query_count",0)} for d in docs]
    return {"nodes": nodes}

@router.get("/gaps")
async def gaps(db: DatabaseDependency, context: TenantContext = Depends(require_permission("documents:read"))) -> list:
    logs = await db["audit_logs"].find({"org_id": context.org_id, "confidence_label": "low"}).limit(20).to_list(20)
    return [{"query": l.get("query",""), "confidence": l.get("confidence",0)} for l in logs]

@router.get("/insights")
async def insights(db: DatabaseDependency, context: TenantContext = Depends(require_permission("documents:read"))) -> list:
    docs = await db["documents"].find({"org_id": context.org_id, "freshness_tag": {"$in": ["stale","expired"]}}).limit(10).to_list(10)
    return [{"type": "stale", "message": f"'{d.get('filename')}' may be outdated", "document_id": str(d["_id"])} for d in docs]

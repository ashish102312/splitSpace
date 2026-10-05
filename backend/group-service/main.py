from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import group, expense

app = FastAPI(title="SplitSpace Group Service")

# Setup CORS (though API Gateway will usually handle it)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(group.router, prefix="/api/groups", tags=["Groups"])
app.include_router(expense.router, prefix="/api/expenses", tags=["Expenses"])

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "group-service"}

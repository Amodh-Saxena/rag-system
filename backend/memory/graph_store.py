import json
from pathlib import Path
from typing import Dict, Any, List, Optional

DATA_PATH = Path(__file__).parent.parent / "data" / "nexus-research.json"

class GraphMemoryStore:
    def __init__(self, data_file: Path = DATA_PATH):
        self.data_file = data_file
        self.repository: Dict[str, Any] = {}
        self.nodes: List[Dict[str, Any]] = []
        self.edges: List[Dict[str, Any]] = []
        self.timeline: List[Dict[str, Any]] = []
        self.node_details: Dict[str, Any] = {}
        self.load()

    def load(self):
        if self.data_file.exists():
            with open(self.data_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.repository = data.get("repository", {})
                self.nodes = data.get("nodes", [])
                self.edges = data.get("edges", [])
                self.timeline = data.get("timeline", [])
                self.node_details = data.get("nodeDetails", {})
        else:
            self.repository = {"id": "nexus-research", "nodeCount": 0}
            self.nodes = []
            self.edges = []
            self.timeline = []
            self.node_details = {}

    def get_graph(self) -> Dict[str, Any]:
        return {
            "repository": self.repository,
            "nodes": self.nodes,
            "edges": self.edges,
        }

    def get_timeline(self) -> List[Dict[str, Any]]:
        return self.timeline

    def get_node(self, node_id: str) -> Optional[Dict[str, Any]]:
        if node_id in self.node_details:
            return self.node_details[node_id]
        
        # Fallback: search nodes list
        for n in self.nodes:
            if n.get("id") == node_id:
                return {
                    "id": n["id"],
                    "type": n.get("type", "file"),
                    "label": n.get("label", n["id"]),
                    "path": n.get("path"),
                    "description": n.get("description", "Node recorded in memory graph."),
                    "confidence": 0.90,
                }
        return None

store = GraphMemoryStore()

import { useEffect, useState, useCallback, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import client from "../api/client";

interface NodeObject {
  id: string;
  name: string;
  tag: string;
  type: string;
  is_trusted: boolean;
  x?: number;
  y?: number;
}

interface LinkObject {
  source: string | NodeObject;
  target: string | NodeObject;
}

interface GraphData {
  nodes: NodeObject[];
  links: LinkObject[];
}

const TYPE_COLORS: Record<string, string> = {
  individual: "#4f46e5",
  organization: "#059669",
  project: "#d97706",
};

export default function TrustGraph() {
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    links: [],
  });
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  useEffect(() => {
    client
      .get("/members/graph")
      .then((res) => {
        setGraphData({
          nodes: res.data.nodes,
          links: res.data.edges,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Configure d3 forces for more spacing
  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.d3Force("charge")?.strength(-400).distanceMax(500);
      graphRef.current.d3Force("link")?.distance(180);
      graphRef.current.d3Force("center")?.strength(0.05);
    }
  }, [graphData]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: Math.max(500, window.innerHeight - 200),
        });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const paintNode = useCallback(
    (node: NodeObject, ctx: CanvasRenderingContext2D) => {
      const size = node.type === "individual" ? 14 : 18;
      const color = TYPE_COLORS[node.type] || "#6b7280";

      // Draw node
      ctx.beginPath();
      if (node.type === "organization") {
        // Square for organizations
        ctx.rect(
          (node.x ?? 0) - size,
          (node.y ?? 0) - size,
          size * 2,
          size * 2
        );
      } else if (node.type === "project") {
        // Diamond for projects
        ctx.moveTo(node.x ?? 0, (node.y ?? 0) - size);
        ctx.lineTo((node.x ?? 0) + size, node.y ?? 0);
        ctx.lineTo(node.x ?? 0, (node.y ?? 0) + size);
        ctx.lineTo((node.x ?? 0) - size, node.y ?? 0);
        ctx.closePath();
      } else {
        // Circle for individuals
        ctx.arc(node.x ?? 0, node.y ?? 0, size, 0, 2 * Math.PI);
      }
      ctx.fillStyle = color;
      ctx.fill();

      // Draw border
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw label
      ctx.font = "13px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = "#1f2937";
      ctx.fillText(node.name, node.x ?? 0, (node.y ?? 0) + size + 4);
    },
    []
  );

  if (loading) return <p>Loading trust graph...</p>;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h1 style={{ fontSize: "1.5rem" }}>Trust Graph</h1>
        <div style={{ display: "flex", gap: "1rem", fontSize: "0.85rem" }}>
          {Object.entries(TYPE_COLORS).map(([type, color]) => (
            <span
              key={type}
              style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  background: color,
                  borderRadius: type === "individual" ? "50%" : "2px",
                  display: "inline-block",
                }}
              />
              {type}
            </span>
          ))}
        </div>
      </div>
      <p style={{ color: "#6b7280", marginBottom: "1rem", fontSize: "0.9rem" }}>
        {graphData.nodes.length} members, {graphData.links.length} connections
      </p>
      <div
        ref={containerRef}
        className="graph-container"
      >
        <ForceGraph2D
          graphData={graphData}
          width={dimensions.width}
          height={dimensions.height}
          nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D) =>
            paintNode(node as NodeObject, ctx)
          }
          ref={graphRef}
          nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
            const size = 20;
            ctx.beginPath();
            ctx.arc(node.x ?? 0, node.y ?? 0, size, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
          }}
          linkColor={() => "#d1d5db"}
          linkWidth={2}
          d3AlphaDecay={0.015}
          d3VelocityDecay={0.25}
          cooldownTicks={150}
          onEngineStop={() => graphRef.current?.zoomToFit(400, 60)}
        />
      </div>
    </div>
  );
}

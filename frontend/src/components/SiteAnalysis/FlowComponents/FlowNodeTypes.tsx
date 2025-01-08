import SourceNode from "../FlowNodes/SourceNode";
import StorageNode from "../FlowNodes/StorageNode";
import ConsumerNode from "../FlowNodes/ConsumerNode";
import GridNode from "../FlowNodes/GridNode";
import InverterNode from "../FlowNodes/InverterNode";
import TransformerNode from "../FlowNodes/TransformerNode";
import BESSNode from "../FlowNodes/BESSNode";

export const nodeTypes = {
  source: SourceNode,
  storage: StorageNode,
  consumer: ConsumerNode,
  grid: GridNode,
  inverter: InverterNode,
  transformer: TransformerNode,
  bess: BESSNode,
};
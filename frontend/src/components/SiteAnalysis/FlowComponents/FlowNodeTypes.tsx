import SourceNode from "../FlowNodes/SourceNode";
import StorageNode from "../FlowNodes/StorageNode";
import ConsumerNode from "../FlowNodes/ConsumerNode";
import GridNode from "../FlowNodes/GridNode";
import InverterNode from "../FlowNodes/InverterNode";
import TransformerNode from "../FlowNodes/TransformerNode";
import BESSNode from "../FlowNodes/BESSNode";
import SolarPanelNode from "../FlowNodes/SolarPanelNode";
import WindTurbineNode from "../FlowNodes/WindTurbineNode";
import WindTurbineClusterNode from "../FlowNodes/WindTurbineClusterNode";
import CollectorSubstationNode from "../FlowNodes/CollectorSubstationNode";
import SCADANode from "../FlowNodes/SCADANode";
import SensorNode from "../FlowNodes/SensorNode";

export const nodeTypes = {
  'source': SourceNode,
  'storage': StorageNode,
  'consumer': ConsumerNode,
  'grid': GridNode,
  'inverter': InverterNode,
  'transformer': TransformerNode,
  'bess': BESSNode,
  'solar array': SourceNode,
  'solar panel': SolarPanelNode,
  'wind turbine': WindTurbineNode,
  'wind turbine cluster': WindTurbineClusterNode,
  'collector substation': CollectorSubstationNode,
  'scada system': SCADANode,
  'sensor': SensorNode,
};
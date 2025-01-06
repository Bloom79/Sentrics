export const GRID_UNIT = 150;
export const VERTICAL_SPACING = 100;

export const calculateNodePosition = (column: number, row: number) => ({
  x: column * GRID_UNIT,
  y: row * VERTICAL_SPACING,
});

export const getInitialLayout = (sourceCount: number) => {
  const nodes = [];
  const edges = [];
  
  // Calculate how many rows we need for cells
  const rowsPerSource = 3;
  
  sourceCount.forEach((sourceIndex) => {
    const baseY = sourceIndex * (rowsPerSource * VERTICAL_SPACING);
    
    // Add cells (3 per string)
    for (let i = 0; i < 3; i++) {
      nodes.push({
        id: `cell-${sourceIndex}-${i}`,
        type: 'cell',
        position: calculateNodePosition(0, baseY + i),
        data: {
          type: 'cell',
          label: `Cell ${i + 1}`,
          specs: { voltage: 0.6, current: 8 },
        },
      });
    }
    
    // Add string
    nodes.push({
      id: `string-${sourceIndex}`,
      type: 'string',
      position: calculateNodePosition(1, baseY + 1),
      data: {
        type: 'string',
        label: `String ${sourceIndex + 1}`,
        specs: { voltage: 1.8, current: 8 },
      },
    });
  });

  // Add inverter
  nodes.push({
    id: 'inverter-1',
    type: 'inverter',
    position: calculateNodePosition(2, Math.floor(sourceCount * rowsPerSource / 2)),
    data: {
      type: 'inverter',
      label: 'Inverter',
      specs: { efficiency: 98 },
    },
  });

  // Add transformer
  nodes.push({
    id: 'transformer-1',
    type: 'transformer',
    position: calculateNodePosition(3, Math.floor(sourceCount * rowsPerSource / 2)),
    data: {
      type: 'transformer',
      label: 'Transformer',
      specs: { voltage: 400 },
    },
  });

  // Add storage units
  const storageCount = 2;
  for (let i = 0; i < storageCount; i++) {
    nodes.push({
      id: `storage-${i + 1}`,
      type: 'storage',
      position: calculateNodePosition(4, i * 2 + 1),
      data: {
        type: 'storage',
        label: `Storage Unit ${i + 1}`,
        specs: { capacity: 1000, charge: 750 },
      },
    });
  }

  // Add grid
  nodes.push({
    id: 'grid',
    type: 'grid',
    position: calculateNodePosition(5, 1),
    data: {
      type: 'grid',
      label: 'Power Grid',
    },
  });

  // Add consumers
  const consumerTypes = ['residential', 'industrial', 'commercial'];
  consumerTypes.forEach((type, index) => {
    nodes.push({
      id: `consumer-${type}`,
      type: 'consumer',
      position: calculateNodePosition(5, index * 2 + 3),
      data: {
        type: type,
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} Consumer`,
        consumption: 150 + (index * 100),
      },
    });
  });

  return { nodes, edges };
};
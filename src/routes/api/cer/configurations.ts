import express from 'express';
import { ConfigurationDBService } from '../../../db/services/configuration.service';
import { validateConfiguration } from '../../../validators/configuration.validator';
import { pool } from '../../../db/connection';

const router = express.Router();
const configService = new ConfigurationDBService(pool);

// Get all configurations for a CER
router.get('/:cerId/configurations', async (req, res) => {
  try {
    const { cerId } = req.params;
    const configurations = await configService.getConfigurations(cerId);
    res.json(configurations);
  } catch (error) {
    console.error('Error fetching configurations:', error);
    res.status(500).json({ error: 'Failed to fetch configurations' });
  }
});

// Get a specific configuration
router.get('/:cerId/configurations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const configuration = await configService.getConfiguration(id);
    
    if (!configuration) {
      return res.status(404).json({ error: 'Configuration not found' });
    }
    
    res.json(configuration);
  } catch (error) {
    console.error('Error fetching configuration:', error);
    res.status(500).json({ error: 'Failed to fetch configuration' });
  }
});

// Create a new configuration
router.post('/:cerId/configurations', async (req, res) => {
  try {
    const { cerId } = req.params;
    const configData = req.body;
    
    // Validate configuration data
    const validationResult = validateConfiguration(configData);
    if (!validationResult.isValid) {
      return res.status(400).json({ errors: validationResult.errors });
    }
    
    const id = await configService.createConfiguration(cerId, configData);
    res.status(201).json({ id });
  } catch (error) {
    console.error('Error creating configuration:', error);
    res.status(500).json({ error: 'Failed to create configuration' });
  }
});

// Update a configuration
router.put('/:cerId/configurations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const configData = req.body;
    
    // Validate configuration data
    const validationResult = validateConfiguration(configData, true);
    if (!validationResult.isValid) {
      return res.status(400).json({ errors: validationResult.errors });
    }
    
    await configService.updateConfiguration({ id, ...configData });
    res.status(200).json({ message: 'Configuration updated successfully' });
  } catch (error) {
    console.error('Error updating configuration:', error);
    res.status(500).json({ error: 'Failed to update configuration' });
  }
});

// Delete a configuration
router.delete('/:cerId/configurations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await configService.deleteConfiguration(id);
    res.status(200).json({ message: 'Configuration deleted successfully' });
  } catch (error) {
    console.error('Error deleting configuration:', error);
    res.status(500).json({ error: 'Failed to delete configuration' });
  }
});

// Plant Mapping Routes

// Map plants to a configuration
router.post('/:cerId/configurations/:id/plants', async (req, res) => {
  try {
    const { id } = req.params;
    const { plantIds } = req.body;
    
    if (!Array.isArray(plantIds)) {
      return res.status(400).json({ error: 'plantIds must be an array' });
    }
    
    await configService.mapPlants(id, plantIds);
    res.status(200).json({ message: 'Plants mapped successfully' });
  } catch (error) {
    console.error('Error mapping plants:', error);
    res.status(500).json({ error: 'Failed to map plants' });
  }
});

// Unmap plants from a configuration
router.delete('/:cerId/configurations/:id/plants', async (req, res) => {
  try {
    const { id } = req.params;
    const { plantIds } = req.body;
    
    if (!Array.isArray(plantIds)) {
      return res.status(400).json({ error: 'plantIds must be an array' });
    }
    
    await configService.unmapPlants(id, plantIds);
    res.status(200).json({ message: 'Plants unmapped successfully' });
  } catch (error) {
    console.error('Error unmapping plants:', error);
    res.status(500).json({ error: 'Failed to unmap plants' });
  }
});

// Get plant mappings for a configuration
router.get('/:cerId/configurations/:id/plants', async (req, res) => {
  try {
    const { id } = req.params;
    const mappings = await configService.getPlantMappings(id);
    res.json(mappings);
  } catch (error) {
    console.error('Error fetching plant mappings:', error);
    res.status(500).json({ error: 'Failed to fetch plant mappings' });
  }
});

export default router; 
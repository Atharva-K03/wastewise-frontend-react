import React, { createContext, useContext, useState, useEffect } from 'react';

const PickupContext = createContext();

export const usePickup = () => {
  const context = useContext(PickupContext);
  if (!context) {
    throw new Error('usePickup must be used within a PickupProvider');
  }
  return context;
};

export const PickupProvider = ({ children }) => {
  const [pickups, setPickups] = useState([]);
  const [nextPickupId, setNextPickupId] = useState(1);
  const [workers, setWorkers] = useState([]); // Manage workers state here
  const [nextWorkerId, setNextWorkerId] = useState(4); // Start from W004
  const [zones, setZones] = useState([]); // Manage zones state here
  const [nextZoneId, setNextZoneId] = useState(1); // Start from Z001
  const [routes, setRoutes] = useState([]); // Manage routes state here
  const [nextRouteId, setNextRouteId] = useState(1); // Start from R001

  // Dummy data for vehicles (already present)
  const vehicles = [
    { id: 'V001', name: 'Truck Alpha' },
    { id: 'V002', name: 'Truck Beta' },
    { id: 'V003', name: 'Truck Gamma' },
    { id: 'V004', name: 'Truck Delta' },
    { id: 'V005', name: 'Truck Echo' }
  ];

  useEffect(() => {
    // Load initial dummy data for pickups
    const initialPickups = [
      {
        id: 'P001',
        zone: 'Z001',
        location: 'Main Street Plaza',
        startTime: '10:00',
        endTime: '11:00',
        frequency: 'Daily',
        vehicle: 'V001',
        worker1: 'W001',
        worker2: 'W002',
        status: 'Scheduled',
        createdAt: new Date().toISOString()
      },
      {
        id: 'P002',
        zone: 'Z002',
        location: 'Residential Complex A',
        startTime: '14:00',
        endTime: '15:00',
        frequency: 'Weekly',
        vehicle: 'V002',
        worker1: 'W003',
        worker2: 'W004',
        status: 'Scheduled',
        createdAt: new Date().toISOString()
      }
    ];
    setPickups(initialPickups);
    setNextPickupId(3);

    // Load initial dummy data for workers
    const initialWorkers = [
      { id: 'W001', name: 'Admin User', phone: '111-222-3333', email: 'admin@example.com', roleId: '001', status: 'available' },
      { id: 'W002', name: 'Scheduler User', phone: '444-555-6666', email: 'scheduler@example.com', roleId: '002', status: 'available' },
      { id: 'W003', name: 'Worker User', phone: '777-888-9999', email: 'worker@example.com', roleId: '003', status: 'occupied' },
      { id: 'W004', name: 'Lisa Davis', phone: '123-456-7890', email: 'lisa.davis@example.com', roleId: '003', status: 'available' },
      { id: 'W005', name: 'Tom Miller', phone: '098-765-4321', email: 'tom.miller@example.com', roleId: '003', status: 'absent' },
      { id: 'W006', name: 'Emma Garcia', phone: '111-111-1111', email: 'emma.garcia@example.com', roleId: '003', status: 'available' },
      { id: 'W007', name: 'James Rodriguez', phone: '222-222-2222', email: 'james.r@example.com', roleId: '003', status: 'occupied' },
      { id: 'W008', name: 'Anna Martinez', phone: '333-333-3333', email: 'anna.m@example.com', roleId: '003', status: 'available' }
    ];
    setWorkers(initialWorkers);
    setNextWorkerId(initialWorkers.length + 1); // Set next ID based on initial workers

    // Load initial dummy data for zones
    const initialZones = [
      { id: 'Z001', name: 'Downtown Commercial', areaCoverage: '10 sq km' },
      { id: 'Z002', name: 'Residential North', areaCoverage: '15 sq km' },
      { id: 'Z003', name: 'Industrial East', areaCoverage: '8 sq km' },
    ];
    setZones(initialZones);
    setNextZoneId(initialZones.length + 1);

    // Load initial dummy data for routes
    const initialRoutes = [
      { id: 'R001', zoneId: 'Z001', name: 'Route 1 - Downtown', description: 'Covers main commercial streets' },
      { id: 'R002', zoneId: 'Z001', name: 'Route 2 - Financial District', description: 'Covers financial area' },
      { id: 'R003', zoneId: 'Z002', name: 'Route 1 - North Residential', description: 'Covers northern residential blocks' },
    ];
    setRoutes(initialRoutes);
    setNextRouteId(initialRoutes.length + 1);

  }, []);

  const createPickup = (pickupData) => {
    const newPickup = {
      ...pickupData,
      id: `P${String(nextPickupId).padStart(3, '0')}`,
      status: 'Scheduled',
      createdAt: new Date().toISOString()
    };
    setPickups(prev => [...prev, newPickup]);
    setNextPickupId(prev => prev + 1);
    return newPickup;
  };

  const deletePickup = (pickupId) => {
    setPickups(prev => prev.filter(pickup => pickup.id !== pickupId));
  };

  const updatePickup = (pickupId, updatedData) => {
    setPickups(prev =>
      prev.map(pickup =>
        pickup.id === pickupId
          ? { ...pickup, ...updatedData } // Merge updatedData into the existing pickup
          : pickup
      )
    );
  };

  const createWorker = (workerData) => {
    const newWorker = {
      ...workerData,
      id: `W${String(nextWorkerId).padStart(3, '0')}`,
      status: workerData.status || 'available', // Ensure status is set, default to available
    };
    setWorkers(prev => [...prev, newWorker]);
    setNextWorkerId(prev => prev + 1);
    return newWorker;
  };

  const updateWorker = (workerId, updatedData) => {
    setWorkers(prev =>
      prev.map(worker =>
        worker.id === workerId
          ? { ...worker, ...updatedData } // Merge updatedData into the existing worker
          : worker
      )
    );
  };

  const deleteWorker = (workerId) => {
    setWorkers(prev => prev.filter(worker => worker.id !== workerId));
  };

  const createZone = (zoneData) => {
    const newZone = {
      ...zoneData,
      id: `Z${String(nextZoneId).padStart(3, '0')}`,
    };
    setZones(prev => [...prev, newZone]);
    setNextZoneId(prev => prev + 1);
    return newZone;
  };

  const updateZone = (zoneId, updatedData) => {
    setZones(prev =>
      prev.map(zone =>
        zone.id === zoneId
          ? { ...zone, ...updatedData }
          : zone
      )
    );
  };

  const deleteZone = (zoneId) => {
    setZones(prev => prev.filter(zone => zone.id !== zoneId));
  };

  const createRoute = (routeData) => {
    const newRoute = {
      ...routeData,
      id: `R${String(nextRouteId).padStart(3, '0')}`,
    };
    setRoutes(prev => [...prev, newRoute]);
    setNextRouteId(prev => prev + 1);
    return newRoute;
  };

  const updateRoute = (routeId, updatedData) => {
    setRoutes(prev =>
      prev.map(route =>
        route.id === routeId
          ? { ...route, ...updatedData }
          : route
      )
    );
  };

  const deleteRoute = (routeId) => {
    setRoutes(prev => prev.filter(route => route.id !== routeId));
  };

  const getZoneName = (zoneId) => {
    const zone = zones.find(z => z.id === zoneId);
    return zone ? zone.name : 'Unknown Zone';
  };

  const getVehicleName = (vehicleId) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? vehicle.name : 'Unknown Vehicle';
  };

  const getWorkerName = (workerId) => {
    const worker = workers.find(w => w.id === workerId);
    return worker ? worker.name : 'Unknown Worker';
  };

  const getRoutesByZoneId = (zoneId) => {
    return routes.filter(route => route.zoneId === zoneId);
  };

  const value = {
    pickups,
    zones,
    vehicles,
    workers,
    routes,
    createPickup,
    deletePickup,
    updatePickup,
    createWorker,
    updateWorker,
    deleteWorker,
    createZone,
    updateZone,
    deleteZone,
    createRoute,
    updateRoute,
    deleteRoute,
    getZoneName,
    getVehicleName,
    getWorkerName,
    getRoutesByZoneId,
  };

  return (
    <PickupContext.Provider value={value}>
      {children}
    </PickupContext.Provider>
  );
};

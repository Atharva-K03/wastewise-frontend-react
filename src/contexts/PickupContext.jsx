import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, isWithinInterval, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

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
  const [logs, setLogs] = useState([]); // Manage logs state here
  const [assignments, setAssignments] = useState([]); // Manage assignments state here
  const [nextAssignmentId, setNextAssignmentId] = useState(1); // Start from A001

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
      { id: 'Z001-R001', zoneId: 'Z001', name: 'Route 1 - Downtown', pathDetails: 'Main St, Elm St, Oak Ave', estimatedTime: '2 hours' },
      { id: 'Z001-R002', zoneId: 'Z001', name: 'Route 2 - Financial District', pathDetails: 'Wall St, Broad St', estimatedTime: '1 hour 30 minutes' },
      { id: 'Z002-R001', zoneId: 'Z002', name: 'Route 1 - North Residential', pathDetails: 'Maple Ave, Pine Ln, Cedar Rd', estimatedTime: '3 hours' },
    ];
    setRoutes(initialRoutes);
    setNextRouteId(initialRoutes.length + 1);

    // Load initial dummy data for logs
    const initialLogs = [
      { zoneId: 'Z001', vehicleId: 'V001', collectionStartTime: '2025-06-25T10:00:00Z', collectionEndTime: '2025-06-25T10:30:00Z', weightCollected: 150, status: 'Completed' },
      { zoneId: 'Z001', vehicleId: 'V002', collectionStartTime: '2025-06-25T11:00:00Z', collectionEndTime: '2025-06-25T11:45:00Z', weightCollected: 200, status: 'Completed' },
      { zoneId: 'Z002', vehicleId: 'V001', collectionStartTime: '2025-06-26T09:00:00Z', collectionEndTime: '2025-06-26T09:50:00Z', weightCollected: 180, status: 'Completed' },
      { zoneId: 'Z003', vehicleId: 'V003', collectionStartTime: '2025-06-26T14:00:00Z', collectionEndTime: '2025-06-26T14:30:00Z', weightCollected: 120, status: 'Completed' },
      { zoneId: 'Z001', vehicleId: 'V001', collectionStartTime: '2025-06-27T10:00:00Z', collectionEndTime: null, weightCollected: null, status: 'InProgress' },
      { zoneId: 'Z002', vehicleId: 'V002', collectionStartTime: '2025-06-27T11:00:00Z', collectionEndTime: '2025-06-27T11:30:00Z', weightCollected: 160, status: 'Completed' },
      { zoneId: 'Z001', vehicleId: 'V001', collectionStartTime: '2025-06-28T10:00:00Z', collectionEndTime: '2025-06-28T10:30:00Z', weightCollected: 170, status: 'Completed' },
      { zoneId: 'Z001', vehicleId: 'V002', collectionStartTime: '2025-06-28T11:00:00Z', collectionEndTime: '2025-06-28T11:45:00Z', weightCollected: 210, status: 'Completed' },
      { zoneId: 'Z002', vehicleId: 'V001', collectionStartTime: '2025-06-29T09:00:00Z', collectionEndTime: '2025-06-29T09:50:00Z', weightCollected: 190, status: 'Completed' },
      { zoneId: 'Z003', vehicleId: 'V003', collectionStartTime: '2025-06-29T14:00:00Z', collectionEndTime: '2025-06-29T14:30:00Z', weightCollected: 130, status: 'Completed' },
      { zoneId: 'Z001', vehicleId: 'V001', collectionStartTime: '2025-06-30T10:00:00Z', collectionEndTime: null, weightCollected: null, status: 'InProgress' },
      { zoneId: 'Z002', vehicleId: 'V002', collectionStartTime: '2025-06-30T11:00:00Z', collectionEndTime: '2025-06-30T11:30:00Z', weightCollected: 175, status: 'Completed' },
    ];
    setLogs(initialLogs);

    // Dummy data for assignments
    const initialAssignments = [
      { id: 'A001', routeId: 'Z001-R001', assignedTo: 'W004', status: 'Pending' },
      { id: 'A002', routeId: 'Z001-R001', assignedTo: 'W005', status: 'Completed' },
      { id: 'A003', routeId: 'Z002-R001', assignedTo: 'W006', status: 'InProgress' },
    ];
    setAssignments(initialAssignments);
    setNextAssignmentId(initialAssignments.length + 1);

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
    // Check if any routes are assigned to this zone
    const routesAssigned = routes.filter(route => route.zoneId === zoneId);
    if (routesAssigned.length > 0) {
      return { success: false, message: 'Cannot delete zone. Routes are assigned to this zone.', assignedRoutes: routesAssigned };
    }
    setZones(prev => prev.filter(zone => zone.id !== zoneId));
    return { success: true, message: 'Zone deleted successfully.' };
  };

  const createRoute = (routeData) => {
    const newRouteIdNum = routes.filter(r => r.zoneId === routeData.zoneId).length + 1;
    const newRoute = {
      ...routeData,
      id: `${routeData.zoneId}-R${String(newRouteIdNum).padStart(3, '0')}`,
    };
    setRoutes(prev => [...prev, newRoute]);
    // No need to increment nextRouteId global counter as it's per zone
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
    // Check if any assignments are linked to this route
    const assignmentsLinked = assignments.filter(assignment => assignment.routeId === routeId);
    if (assignmentsLinked.length > 0) {
      return { success: false, message: 'Cannot delete route. Assignments are linked to this route.', assignedAssignments: assignmentsLinked };
    }
    setRoutes(prev => prev.filter(route => route.id !== routeId));
    return { success: true, message: 'Route deleted successfully.' };
  };

  const createAssignment = (assignmentData) => {
    const newAssignment = {
      ...assignmentData,
      id: `A${String(nextAssignmentId).padStart(3, '0')}`,
    };
    setAssignments(prev => [...prev, newAssignment]);
    setNextAssignmentId(prev => prev + 1);
    return newAssignment;
  };

  const updateAssignment = (assignmentId, updatedData) => {
    setAssignments(prev =>
      prev.map(assignment =>
        assignment.id === assignmentId
          ? { ...assignment, ...updatedData }
          : assignment
      )
    );
  };

  const deleteAssignment = (assignmentId) => {
    setAssignments(prev => prev.filter(assignment => assignment.id !== assignmentId));
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

  const getAssignmentsByRouteId = (routeId) => {
    return assignments.filter(assignment => assignment.routeId === routeId);
  };

  const getLogs = (type, id, startDate, endDate) => {
    let filteredLogs = logs;
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (type === 'zone' && id) {
      filteredLogs = filteredLogs.filter(log => log.zoneId === id);
    } else if (type === 'vehicle' && id) {
      filteredLogs = filteredLogs.filter(log => log.vehicleId === id);
    }

    if (start) {
      filteredLogs = filteredLogs.filter(log => parseISO(log.collectionStartTime) >= start);
    }
    if (end) {
      filteredLogs = filteredLogs.filter(log => parseISO(log.collectionStartTime) <= end);
    }
    return filteredLogs;
  };

  const calculateTotalWeightCollected = (filteredLogs) => {
    return filteredLogs.reduce((sum, log) => sum + (log.weightCollected || 0), 0);
  };

  const calculateTotalCollections = (filteredLogs) => {
    return filteredLogs.filter(log => log.status === 'Completed').length;
  };

  const getWeeklySummary = () => {
    const now = new Date();
    const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 1 }); // Monday as start of week
    const endOfCurrentWeek = endOfWeek(now, { weekStartsOn: 1 });

    const weeklyLogs = logs.filter(log => 
      log.status === 'Completed' && 
      isWithinInterval(parseISO(log.collectionStartTime), { start: startOfCurrentWeek, end: endOfCurrentWeek })
    );

    const totalWeight = calculateTotalWeightCollected(weeklyLogs);
    const totalCollections = calculateTotalCollections(weeklyLogs);

    return { totalWeight, totalCollections };
  };

  const getMonthlySummary = () => {
    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);

    const monthlyLogs = logs.filter(log => 
      log.status === 'Completed' && 
      isWithinInterval(parseISO(log.collectionStartTime), { start: startOfCurrentMonth, end: endOfCurrentMonth })
    );

    const totalCollections = calculateTotalCollections(monthlyLogs);

    return { totalCollections };
  };

  const getZoneDailyCollections = (zoneId, startDate, endDate) => {
    const filtered = getLogs('zone', zoneId, startDate, endDate);
    const dailyData = {};

    if (startDate && endDate) {
      const days = eachDayOfInterval({ start: parseISO(startDate), end: parseISO(endDate) });
      days.forEach(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        dailyData[dateStr] = { collections: 0, weight: 0 };
      });
    }

    filtered.forEach(log => {
      const dateStr = format(parseISO(log.collectionStartTime), 'yyyy-MM-dd');
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = { collections: 0, weight: 0 };
      }
      dailyData[dateStr].collections += 1;
      dailyData[dateStr].weight += (log.weightCollected || 0);
    });

    return Object.keys(dailyData).sort().map(date => ({ date, ...dailyData[date] }));
  };

  const getVehicleDailyWeight = (vehicleId, startDate, endDate) => {
    const filtered = getLogs('vehicle', vehicleId, startDate, endDate);
    const dailyData = {};

    if (startDate && endDate) {
      const days = eachDayOfInterval({ start: parseISO(startDate), end: parseISO(endDate) });
      days.forEach(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        dailyData[dateStr] = { weight: 0 };
      });
    }

    filtered.forEach(log => {
      const dateStr = format(parseISO(log.collectionStartTime), 'yyyy-MM-dd');
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = { weight: 0 };
      }
      dailyData[dateStr].weight += (log.weightCollected || 0);
    });

    return Object.keys(dailyData).sort().map(date => ({ date, ...dailyData[date] }));
  };

  const value = {
    pickups,
    zones,
    vehicles,
    workers,
    routes,
    logs,
    assignments,
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
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getZoneName,
    getVehicleName,
    getWorkerName,
    getRoutesByZoneId,
    getAssignmentsByRouteId,
    getLogs,
    getWeeklySummary,
    getMonthlySummary,
    getZoneDailyCollections,
    getVehicleDailyWeight,
  };

  return (
    <PickupContext.Provider value={value}>
      {children}
    </PickupContext.Provider>
  );
};



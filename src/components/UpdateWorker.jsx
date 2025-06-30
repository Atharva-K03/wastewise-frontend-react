import React, { useState, useEffect } from 'react';
import { usePickup } from '../contexts/PickupContext'; // Reusing PickupContext for worker data
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Edit,
  User,
  Phone,
  Mail,
  Briefcase,
  CheckCircle,
  Moon,
  Sun,
  Leaf,
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const UpdateWorker = ({ onBack, onSuccess }) => {
  const { user } = useAuth();
  const { workers, updateWorker } = usePickup(); // Assuming workers and updateWorker are in PickupContext
  const { theme, toggleTheme } = useTheme();

  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    status: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const workerStatuses = ['available', 'occupied', 'absent'];

  // Load worker data when worker ID is selected
  useEffect(() => {
    if (selectedWorkerId) {
      const worker = workers.find(w => w.id === selectedWorkerId);
      if (worker) {
        setSelectedWorker(worker);
        setFormData({
          phone: worker.phone || '',
          email: worker.email || '',
          status: worker.status || 'available'
        });
      }
    } else {
      setSelectedWorker(null);
      setFormData({
        phone: '',
        email: '',
        status: ''
      });
    }
  }, [selectedWorkerId, workers]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedWorkerId) newErrors.workerId = 'Please select a worker to update';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.status) newErrors.status = 'Status is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateWorker(selectedWorkerId, formData);
      setSuccess(true);
      
      // Show success message and redirect after delay
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      setErrors({ submit: 'Failed to update worker. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleWorkerSelect = (workerId) => {
    setSelectedWorkerId(workerId);
    if (errors.workerId) {
      setErrors(prev => ({ ...prev, workerId: '' }));
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-grey-50 to-white-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full p-6 mx-auto mb-4 w-24 h-24 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
            Worker Updated Successfully!
          </h2>
          <p className="text-muted-foreground">
            Redirecting to dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-black-50 dark:from-gray-950 dark:to-gray-800">
      {/* Header */}
      

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Edit className="h-5 w-5" />
                <span>Update Worker</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Worker Selection */}
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Search className="h-4 w-4" />
                    <span>Select Worker to Update</span>
                  </Label>
                  <Select value={selectedWorkerId} onValueChange={handleWorkerSelect}>
                    <SelectTrigger className={errors.workerId ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Choose a worker to update" />
                    </SelectTrigger>
                    <SelectContent>
                      {workers.map((worker) => (
                        <SelectItem key={worker.id} value={worker.id}>
                          {worker.id} - {worker.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.workerId && <p className="text-sm text-red-500">{errors.workerId}</p>}
                </div>

                {/* Display current worker details (read-only) */}
                {selectedWorker && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Current Worker Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>Worker Name</span>
                        </Label>
                        <Input
                          value={selectedWorker.name}
                          disabled
                          className="bg-gray-100 dark:bg-gray-700"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center space-x-2">
                          <Briefcase className="h-4 w-4" />
                          <span>Role ID</span>
                        </Label>
                        <Input
                          value={selectedWorker.roleId}
                          disabled
                          className="bg-gray-100 dark:bg-gray-700"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Editable fields - only show when worker is selected */}
                {selectedWorker && (
                  <>
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Update Contact and Status</h3>
                      
                      {/* Phone and Email */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>Phone Number</span>
                          </Label>
                          <Input
                            id="phone"
                            placeholder="Enter worker's phone number"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className={errors.phone ? 'border-red-500' : ''}
                          />
                          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>Email</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter worker's email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={errors.email ? 'border-red-500' : ''}
                          />
                          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>
                      </div>

                      {/* Status */}
                      <div className="space-y-2">
                        <Label htmlFor="status" className="flex items-center space-x-2">
                          <span>Worker Status</span>
                        </Label>
                        <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                          <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {workerStatuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                      </div>
                    </div>

                    {/* Error Alert */}
                    {errors.submit && (
                      <Alert variant="destructive">
                        <AlertDescription>{errors.submit}</AlertDescription>
                      </Alert>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4 pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Updating...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Edit className="h-4 w-4" />
                            <span>Update Worker</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default UpdateWorker;


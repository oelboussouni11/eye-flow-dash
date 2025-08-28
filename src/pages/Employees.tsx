import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { EmployeeFormModal, Employee } from '@/components/employees/EmployeeFormModal';
import { EmployeeCard } from '@/components/employees/EmployeeCard';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const Employees: React.FC = () => {
  const { user, isOwner } = useAuth();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployeeId, setDeletingEmployeeId] = useState<string | null>(null);

  useEffect(() => {
    loadEmployees();
    loadStores();
  }, [user]);

  const loadStores = () => {
    const allStores = JSON.parse(localStorage.getItem('opti_stores') || '[]');
    const ownerStores = allStores.filter((store: any) => store.ownerId === user?.id);
    setStores(ownerStores);
  };

  const loadEmployees = () => {
    try {
      const allUsers = JSON.parse(localStorage.getItem('opti_users') || '[]');
      const ownerEmployees = allUsers.filter((u: any) => 
        u.role === 'employee' && u.ownerId === user?.id
      );
      setEmployees(ownerEmployees);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast({
        title: "Error",
        description: "Failed to load employees",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleEmployeeSubmit = (employeeData: Omit<Employee, 'id' | 'ownerId' | 'createdAt'>) => {
    const allUsers = JSON.parse(localStorage.getItem('opti_users') || '[]');
    
    if (editingEmployee) {
      // Update existing employee
      const updatedUsers = allUsers.map((u: any) =>
        u.id === editingEmployee.id 
          ? { 
              ...u, 
              ...employeeData,
              // Create employee email with owner domain
              email: `${employeeData.username}@${user?.email}`
            }
          : u
      );
      localStorage.setItem('opti_users', JSON.stringify(updatedUsers));
      setEmployees(prev => prev.map(emp => 
        emp.id === editingEmployee.id 
          ? { 
              ...emp, 
              ...employeeData,
              email: `${employeeData.username}@${user?.email}`
            }
          : emp
      ));
    } else {
      // Create new employee
      const newEmployee: Employee = {
        id: Date.now().toString(),
        ...employeeData,
        email: `${employeeData.username}@${user?.email}`,
        ownerId: user?.id || '',
        createdAt: new Date().toISOString()
      };
      
      allUsers.push(newEmployee);
      localStorage.setItem('opti_users', JSON.stringify(allUsers));
      setEmployees(prev => [...prev, newEmployee]);
    }
  };

  const handleDeleteEmployee = (employeeId: string) => {
    setDeletingEmployeeId(employeeId);
  };

  const confirmDeleteEmployee = () => {
    if (!deletingEmployeeId) return;
    
    const allUsers = JSON.parse(localStorage.getItem('opti_users') || '[]');
    const updatedUsers = allUsers.filter((u: any) => u.id !== deletingEmployeeId);
    localStorage.setItem('opti_users', JSON.stringify(updatedUsers));
    
    setEmployees(prev => prev.filter(emp => emp.id !== deletingEmployeeId));
    setDeletingEmployeeId(null);
    
    toast({
      title: "Success!",
      description: "Employee deleted successfully"
    });
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading employees...</p>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
        <p className="text-muted-foreground">Only store owners can manage employees.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Employees</h1>
          <p className="text-muted-foreground mt-1">
            Manage your team members, permissions, and store assignments
          </p>
        </div>
        
        <Button 
          variant="primary" 
          onClick={handleCreateEmployee}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search employees..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Stats */}
      {employees.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-card p-4 rounded-lg border border-border">
            <div className="text-2xl font-bold text-primary">{employees.length}</div>
            <div className="text-sm text-muted-foreground">Total Employees</div>
          </div>
          <div className="bg-gradient-card p-4 rounded-lg border border-border">
            <div className="text-2xl font-bold text-accent">
              {employees.reduce((sum, emp) => sum + emp.assignedStores.length, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Store Assignments</div>
          </div>
          <div className="bg-gradient-card p-4 rounded-lg border border-border">
            <div className="text-2xl font-bold text-success">Active</div>
            <div className="text-sm text-muted-foreground">Status</div>
          </div>
        </div>
      )}

      {/* Employee Grid */}
      {filteredEmployees.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            {employees.length === 0 ? 'No employees yet' : 'No employees found'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {employees.length === 0 
              ? 'Add your first employee to start building your team'
              : 'Try adjusting your search terms'
            }
          </p>
          {employees.length === 0 && (
            <Button variant="primary" onClick={handleCreateEmployee}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Employee
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
              stores={stores}
            />
          ))}
        </div>
      )}

      {/* Employee Form Modal */}
      <EmployeeFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleEmployeeSubmit}
        employee={editingEmployee}
        mode={editingEmployee ? 'edit' : 'create'}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingEmployeeId} onOpenChange={() => setDeletingEmployeeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this employee? This action cannot be undone and will remove their access to all stores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteEmployee}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Employee
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
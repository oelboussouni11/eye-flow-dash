import React from 'react';
import { Mail, Edit, Trash2, Shield, Store, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Employee } from './EmployeeFormModal';

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
  stores: any[];
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onEdit,
  onDelete,
  stores
}) => {
  const getAssignedStoreNames = () => {
    return stores
      .filter(store => employee.assignedStores.includes(store.id))
      .map(store => store.name);
  };

  const getPermissionCount = () => {
    return Object.values(employee.permissions).reduce((total, perms) => total + perms.length, 0);
  };

  const hasPermission = (section: keyof Employee['permissions'], type: string) => {
    return employee.permissions[section].includes(type as any);
  };

  return (
    <Card className="bg-gradient-card border-border shadow-card hover:shadow-glow transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                {employee.name}
              </CardTitle>
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="w-4 h-4 mr-1" />
                {employee.email}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="w-4 h-4 mr-1" />
                @{employee.username}
              </div>
            </div>
          </div>
          
          <Badge variant="secondary" className="ml-2">
            <Shield className="w-3 h-3 mr-1" />
            {getPermissionCount()} permissions
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Assigned Stores */}
        <div>
          <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
            <Store className="w-4 h-4" />
            Assigned Stores ({employee.assignedStores.length})
          </p>
          <div className="flex flex-wrap gap-1">
            {getAssignedStoreNames().length > 0 ? (
              getAssignedStoreNames().map((storeName, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {storeName}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">No stores assigned</span>
            )}
          </div>
        </div>

        {/* Key Permissions */}
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Key Permissions</p>
          <div className="flex flex-wrap gap-1">
            {Object.entries(employee.permissions).map(([section, perms]) => (
              perms.length > 0 && (
                <Badge 
                  key={section} 
                  variant="secondary" 
                  className="text-xs capitalize"
                >
                  {section}: {perms.length}
                </Badge>
              )
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-2">
        <div className="text-xs text-muted-foreground">
          Added {new Date(employee.createdAt).toLocaleDateString()}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(employee)}
            className="flex items-center gap-1"
          >
            <Edit className="w-3 h-3" />
            Edit
          </Button>
          
          <Button
            variant="delete"
            size="sm"
            onClick={() => onDelete(employee.id)}
            className="flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
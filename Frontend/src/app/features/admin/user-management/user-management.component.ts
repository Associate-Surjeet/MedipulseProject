import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../services/auth/auth.service';
import { UserDto } from '../../../services/auth/auth.models';
import { getAllRoles, getRoleDisplayName } from '../../../shared/extensions/app.extensions';

@Component({
  selector: 'app-user-management',
  standalone: false,
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css',
})
export class UserManagementComponent implements OnInit {
  users: UserDto[]         = [];
  filteredUsers: UserDto[] = [];
  errorMessage   = '';
  successMessage = '';

  isLoading  = false;
  isUpdating = false;
  isAdding   = false;
  isDeleting = false;

  searchQuery        = '';
  selectedRoleFilter = '';

  showRoleModal = false;
  selectedUser: UserDto | null = null;
  roleForm: FormGroup;

  showAddModal = false;
  addForm: FormGroup;

  showDeleteConfirm  = false;
  userToDelete: UserDto | null = null;

  allRoles: string[] = getAllRoles();

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.roleForm = this.fb.group({ role: ['', Validators.required] });
    this.addForm  = this.fb.group({
      name:     ['', [Validators.required, Validators.maxLength(100)]],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/)]],
      phone:    ['', [Validators.pattern(/^\d{10}$/)]],
      role:     ['Nurse', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.authService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message ?? 'Failed to load users.';
        this.isLoading = false;
      },
    });
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter((u) => {
      const matchSearch =
        !this.searchQuery ||
        u.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchRole = !this.selectedRoleFilter || u.role === this.selectedRoleFilter;
      return matchSearch && matchRole;
    });
  }

  onSearch(value: string): void {
    this.searchQuery = value;
    this.applyFilters();
  }

  onRoleFilter(value: string): void {
    this.selectedRoleFilter = value;
    this.applyFilters();
  }

  openRoleModal(user: UserDto): void {
    this.selectedUser = user;
    this.roleForm.setValue({ role: user.role });
    this.showRoleModal = true;
  }

  closeRoleModal(): void {
    this.showRoleModal = false;
    this.selectedUser  = null;
  }

  saveRole(): void {
    const user = this.selectedUser;
    if (this.roleForm.invalid || !user) return;

    this.isUpdating = true;
    this.authService.updateUserRole(user.userId, this.roleForm.value).subscribe({
      next: () => {
        this.isUpdating = false;
        this.showSuccess('Role updated successfully.');
        this.closeRoleModal();
        this.loadUsers();
      },
      error: (err: HttpErrorResponse) => {
        this.isUpdating = false;
        this.errorMessage = err.error?.message ?? 'Failed to update role.';
      },
    });
  }

  openAddModal(): void {
    this.addForm.reset({ role: 'Nurse' });
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  addUser(): void {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }
    this.isAdding = true;
    const val = this.addForm.value;
    this.authService.register({
      name:     val.name,
      email:    val.email,
      password: val.password,
      phone:    val.phone || undefined,
      role:     val.role,
    }).subscribe({
      next: () => {
        this.isAdding = false;
        this.showSuccess('User created successfully.');
        this.closeAddModal();
        this.loadUsers();
      },
      error: (err: HttpErrorResponse) => {
        this.isAdding = false;
        if (err.status === 409) {
          this.errorMessage = 'A user with this email already exists.';
        } else {
          this.errorMessage = err.error?.message ?? 'Failed to create user.';
        }
      },
    });
  }

  confirmDelete(user: UserDto): void {
    this.userToDelete      = user;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.userToDelete      = null;
  }

  deleteUser(): void {
    const user = this.userToDelete;
    if (!user) return;

    this.isDeleting = true;
    this.authService.deleteUser(user.userId).subscribe({
      next: () => {
        this.isDeleting = false;
        this.showSuccess('User deleted successfully.');
        this.cancelDelete();
        this.loadUsers();
      },
      error: (err: HttpErrorResponse) => {
        this.isDeleting = false;
        this.errorMessage = err.error?.message ?? 'Failed to delete user.';
        this.cancelDelete();
      },
    });
  }

  getRoleDisplayName(role: string): string {
    return getRoleDisplayName(role);
  }

  getRoleBadgeClass(role: string): string {
    const map: Record<string, string> = {
      Admin: 'badge--red', SupplyManager: 'badge--blue', PharmacyManager: 'badge--purple',
      DeviceManager: 'badge--cyan', ProcurementOfficer: 'badge--amber',
      ColdChainOperator: 'badge--sky', Nurse: 'badge--green', ComplianceOfficer: 'badge--slate',
    };
    return map[role] ?? 'badge--slate';
  }

  private showSuccess(msg: string): void {
    this.successMessage = msg;
    this.errorMessage   = '';
    setTimeout(() => (this.successMessage = ''), 3500);
  }
}

import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/auth.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @Get()
  @Roles('admin')
  async getAllUsers(@CurrentUser() user: User) {
    // In a real application, you would fetch users from the database
    return {
      message: 'All users retrieved successfully',
      currentUser: user,
      users: [
        {
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
          permissions: ['can_view_dashboard', 'can_manage_users'],
        },
        {
          id: '2',
          email: 'hr@example.com',
          name: 'HR User',
          role: 'hr',
          permissions: ['can_view_dashboard', 'can_manage_employees'],
        },
        {
          id: '3',
          email: 'employee@example.com',
          name: 'Employee User',
          role: 'employee',
          permissions: ['can_view_dashboard'],
        },
      ],
    };
  }

  @ApiOperation({ summary: 'Get current user profile' })
  @Get('me')
  async getCurrentUser(@CurrentUser() user: User) {
    return {
      message: 'User profile retrieved successfully',
      user,
    };
  }
}

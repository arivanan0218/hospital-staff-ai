"""Initial tables

Revision ID: 1d4eac767567
Revises: 
Create Date: 2025-07-26 17:18:02.991640

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1d4eac767567'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('departments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('min_staff_required', sa.Integer(), nullable=True),
    sa.Column('max_staff_capacity', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_index(op.f('ix_departments_id'), 'departments', ['id'], unique=False)
    op.create_table('shifts',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('department_id', sa.Integer(), nullable=True),
    sa.Column('shift_type', sa.Enum('MORNING', 'AFTERNOON', 'NIGHT', 'EMERGENCY', name='shifttype'), nullable=False),
    sa.Column('start_time', sa.DateTime(), nullable=False),
    sa.Column('end_time', sa.DateTime(), nullable=False),
    sa.Column('required_staff_count', sa.Integer(), nullable=True),
    sa.Column('required_skills', sa.Text(), nullable=True),
    sa.Column('status', sa.Enum('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', name='shiftstatus'), nullable=True),
    sa.Column('priority_level', sa.Integer(), nullable=True),
    sa.Column('notes', sa.Text(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['department_id'], ['departments.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_shifts_id'), 'shifts', ['id'], unique=False)
    op.create_table('staff',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('employee_id', sa.String(), nullable=False),
    sa.Column('first_name', sa.String(), nullable=False),
    sa.Column('last_name', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('phone', sa.String(), nullable=True),
    sa.Column('role', sa.Enum('DOCTOR', 'NURSE', 'TECHNICIAN', 'ADMINISTRATOR', 'SUPPORT', name='staffrole'), nullable=False),
    sa.Column('department_id', sa.Integer(), nullable=True),
    sa.Column('status', sa.Enum('ACTIVE', 'INACTIVE', 'ON_LEAVE', name='staffstatus'), nullable=True),
    sa.Column('hire_date', sa.DateTime(), nullable=True),
    sa.Column('hourly_rate', sa.Float(), nullable=True),
    sa.Column('max_hours_per_week', sa.Integer(), nullable=True),
    sa.Column('skills', sa.Text(), nullable=True),
    sa.Column('certifications', sa.Text(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['department_id'], ['departments.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_staff_email'), 'staff', ['email'], unique=True)
    op.create_index(op.f('ix_staff_employee_id'), 'staff', ['employee_id'], unique=True)
    op.create_index(op.f('ix_staff_id'), 'staff', ['id'], unique=False)
    op.create_table('shift_assignments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('shift_id', sa.Integer(), nullable=True),
    sa.Column('staff_id', sa.Integer(), nullable=True),
    sa.Column('assigned_at', sa.DateTime(), nullable=True),
    sa.Column('assigned_by', sa.String(), nullable=True),
    sa.Column('is_confirmed', sa.Boolean(), nullable=True),
    sa.Column('notes', sa.Text(), nullable=True),
    sa.ForeignKeyConstraint(['shift_id'], ['shifts.id'], ),
    sa.ForeignKeyConstraint(['staff_id'], ['staff.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_shift_assignments_id'), 'shift_assignments', ['id'], unique=False)
    op.create_table('staff_availability',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('staff_id', sa.Integer(), nullable=True),
    sa.Column('date', sa.DateTime(), nullable=False),
    sa.Column('is_available', sa.Boolean(), nullable=True),
    sa.Column('preferred_start_time', sa.DateTime(), nullable=True),
    sa.Column('preferred_end_time', sa.DateTime(), nullable=True),
    sa.Column('max_hours', sa.Integer(), nullable=True),
    sa.Column('notes', sa.Text(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['staff_id'], ['staff.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_staff_availability_id'), 'staff_availability', ['id'], unique=False)
    op.create_table('attendance',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('staff_id', sa.Integer(), nullable=True),
    sa.Column('shift_assignment_id', sa.Integer(), nullable=True),
    sa.Column('clock_in', sa.DateTime(), nullable=True),
    sa.Column('clock_out', sa.DateTime(), nullable=True),
    sa.Column('break_start', sa.DateTime(), nullable=True),
    sa.Column('break_end', sa.DateTime(), nullable=True),
    sa.Column('total_hours', sa.Float(), nullable=True),
    sa.Column('overtime_hours', sa.Float(), nullable=True),
    sa.Column('is_absent', sa.Boolean(), nullable=True),
    sa.Column('absence_reason', sa.Text(), nullable=True),
    sa.Column('notes', sa.Text(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['shift_assignment_id'], ['shift_assignments.id'], ),
    sa.ForeignKeyConstraint(['staff_id'], ['staff.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_attendance_id'), 'attendance', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_attendance_id'), table_name='attendance')
    op.drop_table('attendance')
    op.drop_index(op.f('ix_staff_availability_id'), table_name='staff_availability')
    op.drop_table('staff_availability')
    op.drop_index(op.f('ix_shift_assignments_id'), table_name='shift_assignments')
    op.drop_table('shift_assignments')
    op.drop_index(op.f('ix_staff_id'), table_name='staff')
    op.drop_index(op.f('ix_staff_employee_id'), table_name='staff')
    op.drop_index(op.f('ix_staff_email'), table_name='staff')
    op.drop_table('staff')
    op.drop_index(op.f('ix_shifts_id'), table_name='shifts')
    op.drop_table('shifts')
    op.drop_index(op.f('ix_departments_id'), table_name='departments')
    op.drop_table('departments')
    # ### end Alembic commands ###

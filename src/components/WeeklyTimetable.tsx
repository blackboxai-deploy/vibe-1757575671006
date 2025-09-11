'use client';

import React from 'react';
import { Subject, DAYS_OF_WEEK, DAY_LABELS, type DayOfWeek } from '@/lib/types';
import { generateTimeSlots, getSubjectPosition } from '@/lib/utils';
import { SubjectBlock } from './SubjectBlock';

interface WeeklyTimetableProps {
  subjects: Subject[];
  onEditSubject?: (subject: Subject) => void;
  onDeleteSubject?: (subjectId: string) => void;
  startHour?: number;
  endHour?: number;
}

export function WeeklyTimetable({ 
  subjects, 
  onEditSubject, 
  onDeleteSubject,
  startHour = 7,
  endHour = 22 
}: WeeklyTimetableProps) {
  const timeSlots = generateTimeSlots(startHour, endHour);

  // Group subjects by day
  const subjectsByDay = DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day] = subjects.filter(subject => subject.days.includes(day));
    return acc;
  }, {} as Record<DayOfWeek, Subject[]>);

  // Calculate row height for each hour (60px per hour)
  const hourHeight = 60;

  const renderDayColumn = (day: DayOfWeek) => {
    const daySubjects = subjectsByDay[day];

    return (
      <div key={day} className="relative min-h-full">
        {/* Day Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-3">
          <h3 className="text-sm font-semibold text-gray-900 text-center">
            {DAY_LABELS[day]}
          </h3>
        </div>

        {/* Day Content */}
        <div 
          className="relative"
          style={{ height: timeSlots.length * hourHeight }}
        >
          {/* Time Grid Lines */}
          {timeSlots.map((slot, index) => (
            <div
              key={slot.time24}
              className="absolute left-0 right-0 border-b border-gray-100"
              style={{ top: index * hourHeight, height: hourHeight }}
            />
          ))}

          {/* Subject Blocks */}
          {daySubjects.map((subject) => {
            const { top, height } = getSubjectPosition(subject.timeSlot, startHour);
            
            return (
              <div
                key={`${day}-${subject.id}`}
                className="absolute left-1 right-1 z-20"
                style={{
                  top: top,
                  height: height,
                  minHeight: '40px'
                }}
              >
                <SubjectBlock
                  subject={subject}
                  onEdit={onEditSubject}
                  onDelete={onDeleteSubject}
                  className="h-full"
                />
              </div>
            );
          })}

          {/* Empty State for Day */}
          {daySubjects.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-400 p-4">
                <div className="text-2xl mb-2">📅</div>
                <p className="text-sm">No classes</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (subjects.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No subjects added yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first subject to see your weekly schedule
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> Add subjects with different colors to easily distinguish your classes!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="grid grid-cols-8 min-h-[600px]">
        {/* Time Column */}
        <div className="border-r border-gray-200 bg-gray-50">
          {/* Header Spacer */}
          <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 p-3">
            <div className="text-sm font-semibold text-gray-600 text-center">Time</div>
          </div>
          
          {/* Time Slots */}
          <div 
            className="relative"
            style={{ height: timeSlots.length * hourHeight }}
          >
            {timeSlots.map((slot, index) => (
              <div
                key={slot.time24}
                className="absolute left-0 right-0 border-b border-gray-200 px-2 py-1 flex items-center justify-center"
                style={{ top: index * hourHeight, height: hourHeight }}
              >
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-900">
                    {slot.time12}
                  </div>
                  <div className="text-xs text-gray-500">
                    {slot.time24}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Day Columns */}
        {DAYS_OF_WEEK.map(renderDayColumn)}
      </div>

      {/* Schedule Summary */}
      <div className="border-t border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Total subjects: <strong>{subjects.length}</strong>
          </span>
          <span>
            Schedule: <strong>{startHour}:00 - {endHour}:00</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useLocale } from '@/contexts/LocaleContext';

const ScheduleField = ({ scheduledTime, onScheduledTimeChange, t }) => {
  const { locale } = useLocale();

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">{t('booking.schedule.title')}</h3>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {scheduledTime ? format(scheduledTime, 'PPP p', { locale }) : <span>{t('booking.schedule.selectDateTime')}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={scheduledTime}
            onSelect={onScheduledTimeChange}
            initialFocus
          />
          <div className="p-4 border-t">
            <Input
              type="time"
              value={scheduledTime ? format(scheduledTime, 'HH:mm') : ''}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(':');
                const newDate = new Date(scheduledTime || new Date());
                newDate.setHours(parseInt(hours, 10));
                newDate.setMinutes(parseInt(minutes, 10));
                onScheduledTimeChange(newDate);
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ScheduleField;

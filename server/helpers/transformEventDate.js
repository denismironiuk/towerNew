import dayjs from 'dayjs';



export const transformToFullCalendar = (plan) => {
  const date = dayjs(plan.dueDate).format('YYYY-MM-DD');

  const startTime = plan.startTime || '09:00:00';
  let endTime = plan.endTime || '10:00:00';

  // Ensure endTime is after startTime — fallback to +1 hour if identical
  if (startTime === endTime) {
    endTime = dayjs(`${date}T${startTime}`).add(1, 'hour').format('HH:mm:ss');
  }

  const start = dayjs(`${date}T${startTime}`).toISOString();
  const end = dayjs(`${date}T${endTime}`).toISOString();

  return {
    id: plan.id,
    title: plan.activity,
    start,
    end,
    allDay: false, // 💥 Force it to be time-specific
    backgroundColor: plan.status === 'completed' ? '#4caf50' : '#000',
    textColor: '#fff',
    borderColor: '#000',
    status: plan.status,
    recurrence: plan.recurrence,
    activity: plan.activity,
    dueDate: plan.dueDate,
    category: plan.category,
    type: plan.type,
    owner: plan.owner,
    reference: plan.reference,
    createdBy: plan.createdBy,
  };
};



// category:req.body.category,
// type:req.body.type,
// activity:req.body.activity,
// reference:req.body.reference ,
// owner:req.body.owner, 
// dueDate:req.body.duedate ,
// startTime:req.body.startTime ,
// endTime: req.body.endTime,
// recurrence:req.body.recurrence,  
// status:req.body.status ,
// createdBy:req.body.createdBy 


export const revertToOriginalData = (event) => {
  const dueDate = dayjs(event.start).format('YYYY-MM-DD');
  const startTime = dayjs(event.start).format('HH:mm:ss');
  const endTime = dayjs(event.end).format('HH:mm:ss');

  return {
    id: event.id,
    activity: event.activity || event.title,
    dueDate,
    startTime,
    endTime,
    status: event.status,
    recurrence: event.recurrence,
    category: event.category,
    type: event.type,
    reference: event.reference,
    owner: event.owner,
    createdBy: event.createdBy,
  };
};

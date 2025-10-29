// // client/src/dashboard/pages/Dashboard.jsx
// import React, { useState, useEffect } from 'react';
// import DashboardLayout from '../components/DashboardLayout';
// import ProgressSummaryPage from './ProgressSummaryPage';
// import RecentWorkoutsPage from './RecentWorkoutsPage';
// import NutritionLogsPage from './NutritionLogsPage';
// import WeightProgressPage from './WeightProgressPage';
// import WorkoutFrequencyPage from './WorkoutFrequencyPage';
// import MacroDistributionPage from './MacroDistributionPage';

// const mockUser = {
//   name: 'John Doe',
//   profilePic: 'https://via.placeholder.com/150',
// };

// const mockRecentWorkouts = [
//   { id: 1, date: '2023-10-01', type: 'Strength', exercises: ['Bench Press', 'Squats'] },
//   { id: 2, date: '2023-10-02', type: 'Cardio', exercises: ['Running', 'Cycling'] },
//   { id: 3, date: '2023-10-03', type: 'Yoga', exercises: ['Sun Salutation'] },
// ];

// const mockNutritionLogs = [
//   { id: 1, date: '2023-10-01', meal: 'Breakfast', calories: 500, macros: { protein: 20, carbs: 60, fats: 15 } },
//   { id: 2, date: '2023-10-02', meal: 'Lunch', calories: 700, macros: { protein: 30, carbs: 80, fats: 25 } },
//   { id: 3, date: '2023-10-03', meal: 'Dinner', calories: 600, macros: { protein: 25, carbs: 70, fats: 20 } },
// ];

// const mockProgressData = {
//   weight: {
//     labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
//     datasets: [{
//       label: 'Weight (kg)',
//       data: [80, 79, 78, 77],
//       borderColor: '#FDC700',
//       backgroundColor: 'rgba(253, 199, 0, 0.2)',
//     }],
//   },
//   workoutFrequency: {
//     labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//     datasets: [{
//       label: 'Workouts',
//       data: [1, 2, 1, 3, 2, 1, 0],
//       backgroundColor: '#FDC700',
//     }],
//   },
//   macroDistribution: {
//     labels: ['Protein', 'Carbs', 'Fats'],
//     datasets: [{
//       data: [30, 50, 20],
//       backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
//     }],
//   },
// };

// const Dashboard = () => {
//   const [user, setUser] = useState(mockUser);
//   const [recentWorkouts, setRecentWorkouts] = useState(mockRecentWorkouts);
//   const [nutritionLogs, setNutritionLogs] = useState(mockNutritionLogs);
//   const [progressData, setProgressData] = useState(mockProgressData);

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem('user'));
//     if (storedUser) {
//       setUser(storedUser);
//     }
//   }, []);

//   return (
//     <DashboardLayout user={user}>
//       <ProgressSummaryPage />
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <RecentWorkoutsPage workouts={recentWorkouts} />
//         <NutritionLogsPage logs={nutritionLogs} />
//         <WeightProgressPage data={progressData.weight} />
//         <WorkoutFrequencyPage data={progressData.workoutFrequency} />
//         <MacroDistributionPage data={progressData.macroDistribution} />
//       </div>
//     </DashboardLayout>
//   );
// };

// export default Dashboard;
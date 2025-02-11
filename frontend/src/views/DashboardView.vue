<template>
  <MainLayout>
    <div class="space-y-8">
      <!-- En-tête avec statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="stat in stats" :key="stat.name" 
          class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-600">{{ stat.name }}</p>
              <p class="text-2xl font-semibold text-gray-900 mt-2">{{ stat.value }}</p>
            </div>
            <div :class="`rounded-full p-3 ${stat.iconBackground}`">
              <component :is="stat.icon" class="w-6 h-6" :class="stat.iconColor"/>
            </div>
          </div>
        </div>
      </div>

      <!-- Projets et Tâches -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <!-- Projets en cours -->
        <div class="bg-white rounded-xl shadow-sm">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-semibold text-gray-900">Projets en cours</h2>
              <button 
                @click="$router.push('/projects')"
                class="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Voir tout
              </button>
            </div>
            
            <div class="space-y-4">
              <div v-for="project in projects" :key="project.id" 
                class="bg-gray-50 rounded-lg p-4">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h3 class="font-medium text-gray-900">{{ project.name }}</h3>
                    <p class="text-sm text-gray-500 mt-1">{{ project.description }}</p>
                  </div>
                  <span :class="getPriorityBadgeClass(project.priority)">
                    {{ project.priority }}
                  </span>
                </div>
                <!-- Membres du projet -->
                <div class="flex items-center mt-4">
                  <div class="flex -space-x-2">
                    <img 
                      v-for="member in project.members?.slice(0,3)" 
                      :key="member.id"
                      :src="`https://ui-avatars.com/api/?name=${member.username}&background=random`"
                      class="w-8 h-8 rounded-full border-2 border-white"
                      :alt="member.username"
                    >
                  </div>
                  <span v-if="project.members?.length > 3" 
                    class="text-sm text-gray-500 ml-2">
                    +{{ project.members.length - 3 }} others
                  </span>
                </div>
                <!-- Barre de progression -->
                <div class="mb-4">
                  <div class="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progression</span>
                    <span>{{ calculateProgress(project) }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      class="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      :style="{ width: calculateProgress(project) + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mes Tâches -->
        <div class="bg-white rounded-xl shadow-sm">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-semibold text-gray-900">Mes Tâches</h2>
              <button 
                @click="$router.push('/tasks')"
                class="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Voir tout
              </button>
            </div>
            
            <div class="space-y-2">
              <div v-for="task in tasks" :key="task.id" 
                class="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <input 
                  type="checkbox" 
                  :checked="task.status === 'done'"
                  @change="updateTaskStatus(task)"
                  class="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                >
                <div class="ml-3 flex-1">
                  <p class="text-sm font-medium text-gray-900" 
                    :class="{'line-through': task.status === 'done'}">
                    {{ task.title }}
                  </p>
                  <div class="flex items-center mt-1">
                    <span :class="getPriorityBadgeClass(task.priority)" class="mr-2">
                      {{ task.priority }}
                    </span>
                    <span class="text-sm text-gray-500">
                      {{ formatTime(task.timeSpent) }}
                    </span>
                  </div>
                </div>
                <button class="text-gray-400 hover:text-gray-600">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Calendrier -->
      <div class="bg-white rounded-xl shadow-sm">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-semibold text-gray-900">Calendrier</h2>
            <div class="flex space-x-2">
              <button 
                @click="previousMonth"
                class="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <span class="text-lg font-medium">{{ currentMonthYear }}</span>
              <button 
                @click="nextMonth"
                class="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Grille du calendrier -->
          <div class="grid grid-cols-7 gap-px bg-gray-200">
            <!-- En-têtes des jours -->
            <div v-for="day in ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']" 
              :key="day"
              class="bg-gray-50 p-2 text-center text-sm font-medium text-gray-500"
            >
              {{ day }}
            </div>

            <!-- Jours du calendrier -->
            <div v-for="{ date, isCurrentMonth, hasEvents } in calendarDays" 
              :key="date.toISOString()"
              class="bg-white relative p-2 min-h-[100px]"
              :class="{
                'bg-gray-50': !isCurrentMonth,
                'cursor-pointer hover:bg-purple-50': isCurrentMonth
              }"
              @click="isCurrentMonth && selectDate(date)"
            >
              <span 
                class="inline-flex items-center justify-center w-6 h-6 text-sm rounded-full"
                :class="{
                  'bg-purple-600 text-white font-medium': isCurrentMonth && isToday(date),
                  'text-gray-400': !isCurrentMonth,
                  'text-gray-700': isCurrentMonth && !isToday(date)
                }"
              >
                {{ date.getDate() }}
              </span>

              <!-- Événements du jour -->
              <div class="mt-1 space-y-1">
                <!-- Dans la cellule du calendrier -->
                <div
                  v-for="event in getEventsForDate(date)"
                  :key="event.id"
                  class="text-xs px-1 py-0.5 rounded-sm truncate mt-1"
                  :class="{
                    'bg-purple-100 text-purple-700 border-l-4 border-purple-500': event.type === 'task',
                    'bg-blue-100 text-blue-700 border-l-4 border-blue-500': event.type === 'project',
                    'border-yellow-500': event.priority === 'medium',
                    'border-red-500': event.priority === 'high'
                  }"
                >
                  {{ event.title }}
                </div>
                <div v-if="getEventsForDate(date).length > 2" 
                  class="text-xs text-gray-500 pl-1"
                >
                  +{{ getEventsForDate(date).length - 2 }} more
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Modal des événements -->
    <div v-if="selectedDate" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          @click="selectedDate = null"></div>

        <div class="relative bg-white rounded-lg max-w-lg w-full mx-4">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900">
                {{ formatDate(selectedDate) }}
              </h3>
              <button @click="selectedDate = null" class="text-gray-400 hover:text-gray-500">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div class="space-y-3">
              <div v-for="event in getEventsForDate(selectedDate)" :key="event.id"
                class="p-3 rounded-lg"
                :class="{
                  'bg-purple-50': event.type === 'task',
                  'bg-blue-50': event.type === 'project'
                }"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-medium">{{ event.title }}</p>
                    <p class="text-sm text-gray-500">
                      {{ event.type === 'task' ? 'Tâche' : 'Projet' }}
                    </p>
                  </div>
                  <button class="text-gray-400 hover:text-gray-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import MainLayout from '../components/shared/MainLayout.vue'
import api from '../services/api'

// États
const stats = ref([
  {
    name: 'Total Tasks',
    value: 0,
    icon: 'TaskIcon',
    iconBackground: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    name: 'Completed Tasks',
    value: 0,
    icon: 'CheckIcon',
    iconBackground: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    name: 'Active Projects',
    value: 0,
    icon: 'ProjectIcon',
    iconBackground: 'bg-blue-100',
    iconColor: 'text-blue-600'
  }
])

const projects = ref([])
const tasks = ref([])
const events = ref([])

// États du calendrier
const currentDate = ref(new Date())
const selectedDate = ref(null)

// Computed
const currentMonthYear = computed(() => {
  return new Intl.DateTimeFormat('fr-FR', { 
    month: 'long', 
    year: 'numeric' 
  }).format(currentDate.value)
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  const days = []
  
  // Jours du mois précédent
  const firstDayOfWeek = firstDay.getDay()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i)
    days.push({
      date,
      isCurrentMonth: false,
      hasEvents: hasEventsForDate(date)
    })
  }
  
// Jours du mois en cours
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i)
      days.push({
        date,
        isCurrentMonth: true,
        hasEvents: hasEventsForDate(date)
      })
    }
  
    // Compléter avec les jours du mois suivant
    const remainingDays = 42 - days.length // 6 semaines complètes
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i)
      days.push({
        date,
        isCurrentMonth: false,
        hasEvents: hasEventsForDate(date)
      })
    }
  
    return days
})

// Méthodes utilitaires
const hasEventsForDate = (date: Date) => {
  return events.value.some(event => isSameDay(date, new Date(event.date)))
}

const getEventsForDate = (date: Date) => {
  return events.value.filter(event => {
    if (!event.startDate || !event.dueDate) return false;
    
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.dueDate);
    const currentDate = new Date(date);
    
    // Réinitialiser les heures pour comparer uniquement les dates
    eventStart.setHours(0, 0, 0, 0);
    eventEnd.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    
    return currentDate >= eventStart && currentDate <= eventEnd;
  });
};

const isSameDay = (date1: Date, date2: Date) => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear()
}

const isToday = (date: Date) => {
  return isSameDay(date, new Date())
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('fr-FR', { 
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

const getPriorityBadgeClass = (priority: string) => {
  return {
    low: 'bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full',
    medium: 'bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full',
    high: 'bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full'
  }[priority] || ''
}

const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

// Navigation dans le calendrier
const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  )
}

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  )
}

const selectDate = (date: Date) => {
  selectedDate.value = date
}

// Gestion des tâches
const updateTaskStatus = async (task) => {
  try {
    const newStatus = task.status === 'done' ? 'todo' : 'done'
    await api.put(`/tasks/${task.id}`, {
      ...task,
      status: newStatus
    })
    await loadData()
  } catch (error) {
    console.error('Error updating task:', error)
  }
}

const calculateProgress = (project) => {
  // Vérifier si le projet a des tâches
  if (!project.tasks || project.tasks.length === 0) return 0;
  
  // Compter le nombre total de tâches
  const totalTasks = project.tasks.length;
  
  // Compter le nombre de tâches terminées (status === 'done')
  const completedTasks = project.tasks.filter(task => task.status === 'done').length;
  
  // Calculer le pourcentage
  return Math.round((completedTasks / totalTasks) * 100);
};

// Chargement des données
const loadData = async () => {
  try {
    const [projectsRes, tasksRes, statsRes] = await Promise.all([
      api.get('/projects'),
      api.get('/tasks'),
      api.get('/analytics/dashboard')
    ])
    
    projects.value = projectsRes.data
    tasks.value = tasksRes.data
    stats.value[0].value = statsRes.data.totalTasks
    stats.value[1].value = statsRes.data.completedTasks
    stats.value[2].value = projectsRes.data.filter(p => p.status === 'active').length
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  }
}

const loadEvents = async () => {
  try {
    const [tasksRes, projectsRes] = await Promise.all([
      api.get('/tasks'),
      api.get('/projects')
    ]);
    
    const taskEvents = tasksRes.data
      .filter(task => task.startDate && task.dueDate)
      .map(task => ({
        id: `task-${task.id}`,
        title: task.title,
        startDate: task.startDate,
        dueDate: task.dueDate,
        type: 'task',
        priority: task.priority
      }));
    
    const projectEvents = projectsRes.data
      .filter(project => project.startDate && project.dueDate)
      .map(project => ({
        id: `project-${project.id}`,
        title: project.name,
        startDate: project.startDate,
        dueDate: project.dueDate,
        type: 'project',
        priority: project.priority
      }));
    
    events.value = [...taskEvents, ...projectEvents];
  } catch (error) {
    console.error('Error loading events:', error);
  }
};

const handleDateClick = (date: Date, isCurrentMonth: boolean) => {
  if (isCurrentMonth) {
    selectDate(date)
  }
}

// Initialisation
onMounted(() => {
  loadData()
  loadEvents()
})
</script>
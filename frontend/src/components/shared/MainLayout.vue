```vue
<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
    <div class="fixed left-0 top-0 h-full w-64 bg-white shadow-lg p-6 space-y-8">
      <div class="h-8">
        <h1 class="text-xl font-bold text-indigo-600">ProductivTrack</h1>
      </div>

      <nav class="space-y-2">
        <router-link 
          v-for="item in navigation" 
          :key="item.name"
          :to="item.path"
          class="flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-purple-50 hover:text-purple-700"
          :class="{ 'bg-purple-50 text-purple-700': $route.path === item.path }"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3"/>
          {{ item.name }}
        </router-link>
      </nav>
    </div>

    <div class="ml-64 min-h-screen">
      <header class="bg-white shadow-sm">
        <div class="flex justify-between items-center px-8 py-4">
          <div class="relative w-96">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Rechercher projets, tâches..." 
              class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
              @focus="showSearchResults = true"
            >
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            
            <div v-if="showSearchResults && searchQuery" 
              class="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              <div class="p-2">
                <div v-if="isSearching" class="p-4 text-center text-gray-500">
                  Recherche en cours...
                </div>

                <div v-else-if="!hasSearchResults" class="p-4 text-center text-gray-500">
                  Aucun résultat trouvé
                </div>

                <template v-else>
                  <div v-if="filteredProjects.length > 0">
                    <h3 class="text-xs font-medium text-gray-500 px-3 py-2">Projets</h3>
                    <div v-for="project in filteredProjects" :key="'project-'+project.id"
                      class="px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      @click="goToProject(project.id)"
                    >
                      <div class="font-medium text-gray-900">{{ project.name }}</div>
                      <div class="text-sm text-gray-500">{{ project.description }}</div>
                    </div>
                  </div>

                  <div v-if="filteredTasks.length > 0">
                    <h3 class="text-xs font-medium text-gray-500 px-3 py-2 mt-2">Tâches</h3>
                    <div v-for="task in filteredTasks" :key="'task-'+task.id"
                      class="px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      @click="goToTask(task.id)"
                    >
                      <div class="font-medium text-gray-900">{{ task.title }}</div>
                      <div class="text-sm text-gray-500">{{ task.description }}</div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-4">

            <div class="relative">
              <button 
                @click="toggleUserMenu"
                class="flex items-center space-x-3"
              >
                <img 
                  :src="`https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=random`"
                  class="w-8 h-8 rounded-full"
                  :alt="user?.username || 'User'"
                >
                <span class="text-sm font-medium text-gray-700">{{ user?.username || 'User' }}</span>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              <div v-if="showUserMenu" 
                class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div class="py-1">
                  <router-link 
                    to="/profile"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="showUserMenu = false"
                  >
                    Profile
                  </router-link>
                  <router-link 
                    to="/settings"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="showUserMenu = false"
                  >
                    Settings
                  </router-link>
                  <button 
                    @click="handleLogout" 
                    class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main class="p-8">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import api from '../../services/api'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const searchQuery = ref('')
const showSearchResults = ref(false)
const isSearching = ref(false)
const searchResults = ref({ projects: [], tasks: [] })
const showUserMenu = ref(false)
const newMessage = ref('')
let searchDebounce: number

const navigation = [
  { name: 'Dashboard', path: '/dashboard', icon: 'DashboardIcon' },
  { name: 'Projects', path: '/projects', icon: 'ProjectIcon' },
  { name: 'My Tasks', path: '/tasks', icon: 'TaskIcon' },
]

const filteredProjects = computed(() => {
  if (!searchQuery.value) return []
  return searchResults.value.projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const filteredTasks = computed(() => {
  if (!searchQuery.value) return []
  return searchResults.value.tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const hasSearchResults = computed(() => 
  filteredProjects.value.length > 0 || filteredTasks.value.length > 0
)

const handleSearch = async () => {
  if (!searchQuery.value) {
    searchResults.value = { projects: [], tasks: [] }
    return
  }

  isSearching.value = true
  try {
    const [projectsRes, tasksRes] = await Promise.all([
      api.get('/projects', { params: { search: searchQuery.value } }),
      api.get('/tasks', { params: { search: searchQuery.value } })
    ])
    searchResults.value = {
      projects: projectsRes.data,
      tasks: tasksRes.data
    }
  } catch (error) {
    console.error('Search error:', error)
  } finally {
    isSearching.value = false
  }
}

const goToProject = (projectId: number) => {
  router.push(`/projects/${projectId}`)
  showSearchResults.value = false
}

const goToTask = (taskId: number) => {
  router.push(`/tasks/${taskId}`)
  showSearchResults.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const formatTime = (timestamp: string) => {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(timestamp))
}

watch(searchQuery, () => {
  clearTimeout(searchDebounce)
  searchDebounce = setTimeout(handleSearch, 300)
})

const handleClickOutside = (event: MouseEvent) => {
  const searchContainer = document.querySelector('.search-container')
  const userMenuContainer = document.querySelector('.user-menu-container')
  
  if (searchContainer && !searchContainer.contains(event.target as Node)) {
    showSearchResults.value = false
  }
  
  if (userMenuContainer && !userMenuContainer.contains(event.target as Node)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  clearTimeout(searchDebounce)
})
</script>

<style scoped>
</style>
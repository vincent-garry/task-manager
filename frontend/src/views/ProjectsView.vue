<template>
  <MainLayout>
    <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      <!-- En-tête -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-800">Projets</h1>
        <button 
          @click="showNewProjectModal = true"
          class="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg shadow-sm text-sm font-medium hover:bg-purple-700"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nouveau Projet
        </button>
      </div>

      <!-- Grille des projets -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="project in projects" :key="project.id" 
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">{{ project.name }}</h2>
              <p class="text-sm text-gray-500 mt-1">{{ project.description }}</p>
              <!-- Dates du projet -->
              <div class="flex space-x-4 mt-2 text-sm text-gray-500">
                <span>Début: {{ formatDate(project.startDate) }}</span>
                <span>Fin: {{ formatDate(project.dueDate) }}</span>
              </div>
            </div>
            <div class="relative">
              <button 
                @click="toggleProjectMenu(project.id)"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                </svg>
              </button>
              
              <!-- Menu contextuel -->
              <div v-if="openMenuId === project.id"
                class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div class="py-1">
                  <button
                    @click="editProject(project)"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Modifier
                  </button>
                  <button
                    @click="openAddTaskModal(project)"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Ajouter une tâche
                  </button>
                  <button
                    @click="deleteProject(project)"
                    class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Badges de statut et priorité -->
          <div class="flex gap-2 mb-4">
            <span :class="getStatusBadgeClass(project.status)">
              {{ getStatusLabel(project.status) }}
            </span>
            <span :class="getPriorityBadgeClass(project.priority)">
              {{ project.priority }}
            </span>
          </div>

          <!-- Progression -->
          <div class="mb-4">
            <div class="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progression</span>
              <span>{{ calculateProgress(project) }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-purple-600 h-2 rounded-full transition-all"
                :style="{ width: calculateProgress(project) + '%' }"
              ></div>
            </div>
          </div>

          <!-- Tâches -->
          <div class="space-y-2">
            <div class="text-sm font-medium text-gray-700">Tâches ({{ project.tasks?.length || 0 }})</div>
            <div class="flex gap-2">
              <span class="text-xs text-gray-500">
                {{ countTasksByStatus(project, 'done') }} terminées
              </span>
              <span class="text-xs text-gray-500">
                {{ countTasksByStatus(project, 'in_progress') }} en cours
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Nouveau/Modifier Projet -->
      <div v-if="showNewProjectModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" @click="showNewProjectModal = false">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <form @submit.prevent="saveProject">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">Nom du projet</label>
                  <input 
                    type="text" 
                    v-model="projectForm.name"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  >
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    v-model="projectForm.description"
                    rows="3"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  ></textarea>
                </div>
                
                <!-- Dates -->
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Date de début</label>
                    <Datepicker
                      v-model="projectForm.startDate"
                      :format="format"
                      :enable-time-picker="false"
                      locale="fr"
                      auto-apply
                      input-class-name="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Date de fin</label>
                    <Datepicker
                      v-model="projectForm.dueDate"
                      :format="format"
                      :enable-time-picker="false"
                      locale="fr"
                      auto-apply
                      :min-date="projectForm.startDate"
                      input-class-name="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Priorité</label>
                    <select
                      v-model="projectForm.priority"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    >
                      <option value="low">Basse</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Haute</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Statut</label>
                    <select
                      v-model="projectForm.status"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    >
                      <option value="active">Actif</option>
                      <option value="on_hold">En pause</option>
                      <option value="completed">Terminé</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {{ editingProject ? 'Modifier' : 'Créer' }}
                </button>
                <button
                  type="button"
                  @click="showNewProjectModal = false"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import MainLayout from '../components/shared/MainLayout.vue';
import api from '../services/api';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const projects = ref([]);
const showNewProjectModal = ref(false);
const openMenuId = ref(null);
const editingProject = ref(null);

const projectForm = ref({
  name: '',
  description: '',
  priority: 'medium',
  status: 'active',
  startDate: null,
  dueDate: null,
});

// Formatage des dates
const format = (date: Date) => {
  return new Intl.DateTimeFormat('fr-FR').format(date);
};

const formatDate = (date: Date | null) => {
  if (!date) return '-';
  return new Intl.DateTimeFormat('fr-FR').format(new Date(date));
};

// Méthodes utilitaires
const getStatusBadgeClass = (status: string) => {
  return {
    active: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800',
    on_hold: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800',
    completed: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
  }[status] || '';
};

const getPriorityBadgeClass = (priority: string) => {
  return {
    high: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800',
    medium: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800',
    low: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'
  }[priority] || '';
};

const getStatusLabel = (status: string) => {
  return {
    active: 'Actif',
    on_hold: 'En pause',
    completed: 'Terminé'
  }[status] || status;
};

const calculateProgress = (project) => {
  if (!project.tasks || project.tasks.length === 0) return 0;
  const completedTasks = project.tasks.filter(task => task.status === 'done').length;
  return Math.round((completedTasks / project.tasks.length) * 100);
};

const countTasksByStatus = (project, status) => {
  return project.tasks?.filter(task => task.status === status).length || 0;
};

// Actions
const toggleProjectMenu = (projectId: number) => {
  openMenuId.value = openMenuId.value === projectId ? null : projectId;
};

const loadProjects = async () => {
  try {
    const response = await api.get('/projects');
    projects.value = response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des projets:', error);
  }
};

const saveProject = async () => {
  try {
    const projectData = {
      ...projectForm.value,
      startDate: projectForm.value.startDate ? new Date(projectForm.value.startDate).toISOString() : null,
      dueDate: projectForm.value.dueDate ? new Date(projectForm.value.dueDate).toISOString() : null
    };

    if (editingProject.value) {
      await api.put(`/projects/${editingProject.value.id}`, projectData);
    } else {
      await api.post('/projects', projectData);
    }
    await loadProjects();
    showNewProjectModal.value = false;
    editingProject.value = null;
    projectForm.value = {
      name: '',
      description: '',
      startDate: null,
      dueDate: null,
      priority: 'medium',
      status: 'active'
    };
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du projet:', error);
  }
};

const editProject = (project) => {
  editingProject.value = project;
  projectForm.value = {
    ...project,
    startDate: project.startDate ? new Date(project.startDate) : null,
    dueDate: project.dueDate ? new Date(project.dueDate) : null
  };
  showNewProjectModal.value = true;
  openMenuId.value = null;
};

const deleteProject = async (project) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
    try {
      await api.delete(`/projects/${project.id}`);
      await loadProjects();
      openMenuId.value = null;
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
    }
  }
};

// Initialisation
onMounted(loadProjects);

// Gestion des clics en dehors du menu
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      openMenuId.value = null;
    }
  });
});
</script>

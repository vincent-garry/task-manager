<template>
  <MainLayout>
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <!-- En-tête avec bouton d'ajout -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-medium text-gray-900">Mes Tâches</h2>
          <button
            @click="openTaskModal()"
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Nouvelle Tâche
          </button>
        </div>

        <!-- Liste des tâches -->
        <div class="space-y-4">
          <div v-for="task in tasks" :key="task.id" class="border rounded-lg p-4 hover:bg-gray-50">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-medium">{{ task.title }}</h3>
                <p class="text-gray-600">{{ task.description }}</p>
                <div v-if="task.projectId" class="mt-2">
                  <span class="text-sm text-gray-500">
                    Projet : {{ availableProjects.find(p => p.id === task.projectId)?.name }}
                  </span>
                </div>
                <div class="mt-2 flex items-center space-x-4">
                  <span class="text-sm text-gray-500">
                    Status: {{ task.status }}
                  </span>
                  <span class="text-sm text-gray-500">
                    Priorité: {{ task.priority }}
                  </span>
                  <span class="text-sm text-gray-500">
                    Temps passé: {{ task.timeSpent || 0 }}min
                  </span>
                </div>
                <!-- Dates -->
                <div class="mt-2 flex items-center space-x-4">
                  <span class="text-sm text-gray-500">
                    Début: {{ formatDate(task.startDate) }}
                  </span>
                  <span class="text-sm text-gray-500">
                    Échéance: {{ formatDate(task.dueDate) }}
                  </span>
                </div>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="openTimeLogModal(task)"
                  class="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm"
                >
                  Ajouter du temps
                </button>
                <button
                  @click="openTaskModal(task)"
                  class="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm"
                >
                  Éditer
                </button>
                <button
                  @click="deleteTask(task.id)"
                  class="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 text-sm"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Tâche -->
    <div v-if="showTaskModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-medium mb-4">{{ editingTask ? 'Modifier la tâche' : 'Nouvelle tâche' }}</h3>
        <form @submit.prevent="saveTask">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Titre</label>
              <input
                v-model="taskForm.title"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Projet</label>
              <select
                v-model="taskForm.projectId"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Aucun projet</option>
                <option 
                  v-for="project in availableProjects" 
                  :key="project.id" 
                  :value="project.id"
                >
                  {{ project.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                v-model="taskForm.description"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              ></textarea>
            </div>
            <!-- Dates -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Date de début</label>
                <Datepicker
                  v-model="taskForm.startDate"
                  :format="format"
                  :enable-time-picker="false"
                  locale="fr"
                  auto-apply
                  input-class-name="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Date d'échéance</label>
                <Datepicker
                  v-model="taskForm.dueDate"
                  :format="format"
                  :enable-time-picker="false"
                  locale="fr"
                  auto-apply
                  :min-date="taskForm.startDate"
                  input-class-name="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Priorité</label>
              <select
                v-model="taskForm.priority"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
              </select>
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              @click="showTaskModal = false"
              class="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              {{ editingTask ? 'Modifier' : 'Créer' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Time Log -->
    <div v-if="showTimeLogModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-medium mb-4">Ajouter du temps</h3>
        <form @submit.prevent="saveTimeLog">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Temps passé (minutes)</label>
              <input
                v-model="timeLogForm.timeSpent"
                type="number"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                v-model="timeLogForm.description"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              ></textarea>
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              @click="showTimeLogModal = false"
              class="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Enregistrer
            </button>
          </div>
        </form>
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

const tasks = ref([]);
const showTaskModal = ref(false);
const showTimeLogModal = ref(false);
const editingTask = ref(null);
const selectedTask = ref(null);

const taskForm = ref({
  title: '',
  description: '',
  priority: 'medium',
  startDate: null,
  dueDate: null,
  projectId: null  // Nouveau champ
});

const timeLogForm = ref({
  timeSpent: 0,
  description: ''
});

// Formatage des dates
const format = (date: Date) => {
  return new Intl.DateTimeFormat('fr-FR').format(date);
};

const formatDate = (date: Date | null) => {
  if (!date) return '-';
  return new Intl.DateTimeFormat('fr-FR').format(new Date(date));
};

const fetchTasks = async () => {
  try {
    const response = await api.get('/tasks');
    tasks.value = response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des tâches:', error);
  }
};

const openTaskModal = (task = null) => {
  if (task) {
    editingTask.value = task;
    taskForm.value = {
      ...task,
      startDate: task.startDate ? new Date(task.startDate) : null,
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      projectId: task.projectId || null
    };
  } else {
    editingTask.value = null;
    taskForm.value = {
      title: '',
      description: '',
      priority: 'medium',
      startDate: null,
      dueDate: null,
      projectId: null
    };
  }
  showTaskModal.value = true;
};

const openTimeLogModal = (task) => {
  selectedTask.value = task;
  timeLogForm.value = {
    timeSpent: 0,
    description: ''
  };
  showTimeLogModal.value = true;
};

const saveTask = async () => {
  try {
    const taskData = {
      ...taskForm.value,
      startDate: taskForm.value.startDate ? new Date(taskForm.value.startDate).toISOString() : null,
      dueDate: taskForm.value.dueDate ? new Date(taskForm.value.dueDate).toISOString() : null
    };

    if (editingTask.value) {
      await api.put(`/tasks/${editingTask.value.id}`, taskData);
    } else {
      await api.post('/tasks', taskData);
    }
    await fetchTasks();
    showTaskModal.value = false;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la tâche:', error);
  }
};

const saveTimeLog = async () => {
  try {
    await api.post('/time-logs', {
      taskId: selectedTask.value.id,
      ...timeLogForm.value
    });
    await fetchTasks();
    showTimeLogModal.value = false;
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du temps:', error);
  }
};

const deleteTask = async (taskId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
    try {
      await api.delete(`/tasks/${taskId}`);
      await fetchTasks();
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
    }
  }
};

const availableProjects = ref([]);

const loadProjects = async () => {
  try {
    const response = await api.get('/projects');
    availableProjects.value = response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des projets:', error);
  }
};

onMounted(() => {
  fetchTasks();
  loadProjects();
});
</script>
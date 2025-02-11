<template>
  <MainLayout>
    <div class="max-w-3xl mx-auto">
      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Paramètres</h2>

          <!-- Paramètres de notification -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-700">Notifications par email</h4>
                  <p class="text-sm text-gray-500">Recevoir des notifications par email</p>
                </div>
                <button 
                  @click="toggleEmailNotifications"
                  class="relative inline-flex h-6 w-11 items-center rounded-full"
                  :class="settings.emailNotifications ? 'bg-purple-600' : 'bg-gray-200'"
                >
                  <span class="sr-only">Toggle email notifications</span>
                  <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                    :class="settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'"
                  />
                </button>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-700">Notifications push</h4>
                  <p class="text-sm text-gray-500">Recevoir des notifications dans le navigateur</p>
                </div>
                <button 
                  @click="togglePushNotifications"
                  class="relative inline-flex h-6 w-11 items-center rounded-full"
                  :class="settings.pushNotifications ? 'bg-purple-600' : 'bg-gray-200'"
                >
                  <span class="sr-only">Toggle push notifications</span>
                  <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                    :class="settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'"
                  />
                </button>
              </div>
            </div>
          </div>

          <!-- Paramètres d'affichage -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Affichage</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Thème</label>
                <select 
                  v-model="settings.theme"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="light">Clair</option>
                  <option value="dark">Sombre</option>
                  <option value="system">Système</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Langue</label>
                <select 
                  v-model="settings.language"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Boutons -->
          <div class="flex justify-end space-x-3">
            <button 
              @click="resetSettings"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Réinitialiser
            </button>
            <button 
              @click="saveSettings"
              class="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700"
            >
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MainLayout from '../components/shared/MainLayout.vue'
import api from '../services/api'

const settings = ref({
  emailNotifications: true,
  pushNotifications: true,
  theme: 'light',
  language: 'fr'
})

const defaultSettings = {
  emailNotifications: true,
  pushNotifications: true,
  theme: 'light',
  language: 'fr'
}

const toggleEmailNotifications = () => {
  settings.value.emailNotifications = !settings.value.emailNotifications
}

const togglePushNotifications = () => {
  settings.value.pushNotifications = !settings.value.pushNotifications
}

const saveSettings = async () => {
  try {
    await api.put('/users/settings', settings.value)
    alert('Paramètres sauvegardés avec succès')
  } catch (error) {
    console.error('Error saving settings:', error)
    alert('Erreur lors de la sauvegarde des paramètres')
  }
}

const resetSettings = () => {
  settings.value = { ...defaultSettings }
}
</script>
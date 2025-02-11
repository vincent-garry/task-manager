<template>
  <MainLayout>
    <div class="max-w-3xl mx-auto">
      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Profil</h2>
          
          <form @submit.prevent="updateProfile" class="space-y-6">
            <!-- Photo de profil -->
            <div class="flex items-center space-x-6">
              <div class="h-24 w-24 rounded-full overflow-hidden">
                <img 
                  :src="`https://ui-avatars.com/api/?name=${user.username}&size=96`"
                  alt="Profile" 
                  class="h-full w-full object-cover"
                >
              </div>
              <button type="button" class="text-sm text-purple-600 hover:text-purple-700">
                Changer la photo
              </button>
            </div>

            <!-- Informations de base -->
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
                <input 
                  type="text" 
                  v-model="profileForm.username"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  v-model="profileForm.email"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
              </div>
            </div>

            <!-- Boutons -->
            <div class="flex justify-end space-x-3">
              <button 
                type="button"
                @click="resetForm"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700"
              >
                Sauvegarder
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Sécurité -->
      <div class="mt-8 bg-white rounded-lg shadow-sm">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-6">Sécurité</h3>
          
          <form @submit.prevent="updatePassword" class="space-y-6">
            <div class="max-w-md">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Mot de passe actuel</label>
                <input 
                  type="password" 
                  v-model="passwordForm.currentPassword"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                <input 
                  type="password" 
                  v-model="passwordForm.newPassword"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Confirmer le nouveau mot de passe</label>
                <input 
                  type="password" 
                  v-model="passwordForm.confirmPassword"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
              </div>
            </div>

            <div>
              <button 
                type="submit"
                class="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700"
              >
                Mettre à jour le mot de passe
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'
import MainLayout from '../components/shared/MainLayout.vue'

const authStore = useAuthStore()
const user = authStore.user

const profileForm = ref({
  username: user?.username || '',
  email: user?.email || '',
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const updateProfile = async () => {
  try {
    const response = await api.put(`/users/${user.id}`, profileForm.value)
    authStore.updateUser(response.data)
    alert('Profil mis à jour avec succès')
  } catch (error) {
    console.error('Error updating profile:', error)
    alert('Erreur lors de la mise à jour du profil')
  }
}

const updatePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('Les mots de passe ne correspondent pas')
    return
  }

  try {
    await api.put(`/users/${user.id}/password`, {
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    })
    
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    
    alert('Mot de passe mis à jour avec succès')
  } catch (error) {
    console.error('Error updating password:', error)
    alert('Erreur lors de la mise à jour du mot de passe')
  }
}

const resetForm = () => {
  profileForm.value = {
    username: user?.username || '',
    email: user?.email || '',
  }
}
</script>
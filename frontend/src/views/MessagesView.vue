<template>
    <MainLayout>
      <div class="grid grid-cols-3 gap-6 h-[calc(100vh-10rem)]">
        <!-- Liste des conversations -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-4 border-b flex justify-between items-center">
            <h2 class="font-semibold text-lg">Conversations</h2>
            <button 
              @click="showNewConversationModal = true"
              class="p-2 hover:bg-gray-100 rounded-full"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
            </button>
          </div>
          
          <div class="overflow-y-auto h-full">
            <div 
              v-for="conversation in conversations" 
              :key="conversation.id"
              @click="selectConversation(conversation)"
              class="p-4 hover:bg-gray-50 cursor-pointer border-b"
              :class="{'bg-purple-50': selectedConversation?.id === conversation.id}"
            >
              <div class="flex items-center space-x-3">
                <div class="relative">
                  <img 
                    :src="getConversationAvatar(conversation)"
                    class="w-10 h-10 rounded-full"
                  />
                  <span 
                    v-if="hasUnreadMessages(conversation)"
                    class="absolute -top-1 -right-1 w-3 h-3 bg-purple-600 rounded-full"
                  ></span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium truncate">{{ getConversationName(conversation) }}</p>
                  <p class="text-sm text-gray-500 truncate">
                    {{ conversation.lastMessage?.content || 'Aucun message' }}
                  </p>
                </div>
                <span class="text-xs text-gray-500">
                  {{ formatTime(conversation.lastMessage?.createdAt) }}
                </span>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Conversation active -->
        <div class="bg-white rounded-lg shadow col-span-2">
          <div v-if="selectedConversation" class="h-full flex flex-col">
            <!-- En-tête -->
            <div class="p-4 border-b flex items-center">
              <img 
                :src="getConversationAvatar(selectedConversation)"
                class="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h3 class="font-medium">{{ getConversationName(selectedConversation) }}</h3>
                <p class="text-sm text-gray-500">
                  {{ selectedConversation.isGroup ? 
                    `${selectedConversation.participants.length} participants` : 
                    'Conversation privée' }}
                </p>
              </div>
            </div>
  
            <!-- Messages -->
            <div class="flex-1 overflow-y-auto p-4 space-y-4" ref="messagesContainer">
              <div 
                v-for="message in selectedConversation.messages" 
                :key="message.id"
                class="flex"
                :class="{'justify-end': message.sender.id === currentUser.id}"
              >
                <div class="flex items-end space-x-2" :class="{'flex-row-reverse space-x-reverse': message.sender.id === currentUser.id}">
                  <img 
                    :src="`https://ui-avatars.com/api/?name=${message.sender.username}`"
                    class="w-8 h-8 rounded-full"
                    v-if="message.sender.id !== currentUser.id"
                  />
                  <div 
                    class="max-w-md rounded-lg px-4 py-2"
                    :class="message.sender.id === currentUser.id ? 
                      'bg-purple-100 text-purple-900' : 
                      'bg-gray-100 text-gray-900'"
                  >
                    <p v-if="selectedConversation.isGroup && message.sender.id !== currentUser.id"
                      class="text-xs font-medium mb-1"
                    >
                      {{ message.sender.username }}
                    </p>
                    <p>{{ message.content }}</p>
                    <span class="text-xs text-gray-500 mt-1">
                      {{ formatTime(message.createdAt) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Input -->
            <div class="p-4 border-t">
              <div class="flex space-x-2">
                <input 
                  v-model="newMessage"
                  @keyup.enter="sendMessage"
                  type="text"
                  placeholder="Écrivez votre message..."
                  class="flex-1 rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button 
                  @click="sendMessage"
                  class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
  
          <!-- Aucune conversation sélectionnée -->
          <div v-else class="h-full flex items-center justify-center text-gray-500">
            Sélectionnez une conversation pour commencer
          </div>
        </div>
      </div>
  
      <!-- Modal nouvelle conversation -->
      <Modal 
        v-if="showNewConversationModal"
        @close="showNewConversationModal = false"
        @confirm="createConversation"
      >
        <!-- ... Code du modal ... -->
      </Modal>
    </MainLayout>
  </template>
<template>
    <Transition name="modal-fade">
      <div v-if="isVisible" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <h3 class="modal-title">Delete User?</h3>
          <p class="modal-body">Are you sure you want to delete {{ user.firstName }} {{ user.lastName }}?</p>
          <div class="modal-footer">
            <button @click="confirmDelete" class="btn btn-danger">Delete</button>
            <button @click="closeModal" class="btn btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </Transition>
  </template>
  
  <script>
  export default {
    props: {
      isVisible: {
        type: Boolean,
        required: true,
      },
      user: {
        type: Object,
        required: true,
      },
    },
    methods: {
      closeModal() {
        this.$emit('close');
      },
      confirmDelete() {
        this.$emit('delete', this.user.id);
      },
    },
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    max-width: 400px;
    width: 100%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
  
  .modal-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .modal-body {
    margin-bottom: 1.5rem;
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
  
  .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }
  
  .btn-danger {
    background-color: #dc3545;
    color: white;
  }
  
  .btn-secondary {
    background-color: #6c757d;
    color: white;
  }
  
  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;
  }
  </style>
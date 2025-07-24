<template>
    <div class="modal fade" :id="props.modal_id" tabindex="-1" 
         :data-bs-backdrop="props.static ? 'static' : true">
      <div class="modal-dialog modal-dialog-centered" :class="props.modalClass">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">
              {{ props.title }}
            </h4>
          </div>
          <slot></slot>
        </div>
      </div>
    </div>
    
  </template>

<script setup lang="ts">
const props = defineProps({
    modal_id: {
        type: String,
        default: 'staticBackdrop'
    },
    title: {
        type: String,
        default: 'Modal title'
    },
    modalClass: {
        type: String,
        default: 'modal-md'
    },
    static: {
        type: Boolean,
        default: false
    }
});

</script>
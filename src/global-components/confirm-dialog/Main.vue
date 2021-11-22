<template>
  <div id='global-confirm-modal' ref='dialogRef' class='modal' tabindex='-1' aria-hidden='true'>
    <div class='modal-dialog modal-md'>
      <div class='modal-content'>
        <!-- BEGIN: Modal Header -->
        <div class='modal-header'>
          <h2 class='font-medium text-base mr-auto'> {{ props.title }} </h2>
        </div>
        <!-- END: Modal Header -->
        <div class='modal-body mx-8'>
          {{ props.content }}
        </div>
        <div class='modal-footer text-right'>
          <button type='button' class='btn btn-primary w-24' @click='confirm' :disabled='loading'>
            <LoadingIcon v-if='loading' icon="oval" color="white" class="w-4 h-4 m-2" />
            Confirm
          </button>
          <button type='button' class='btn btn-outline w-24 ml-4' @click="props.cancelDialog()">Cancel</button>
        </div> <!-- END: Modal Footer -->
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue'

export default {
  props: {
    title: {
      type: String,
      required: false,
      defailt: 'Confirm dialog'
    },
    content: {
      type: String,
      required: false,
      defailt: 'Are you sure?'
    },
    dialogShow: {
      type: Boolean,
      required: true,
      defailt: false
    },
    cancelDialog: {
      type: Function,
      required: true
    },
    callBack: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const loading = ref(false)
    const dialogRef = ref()

    const confirm = async () => {
      loading.value = true
      await props.callBack()
      loading.value = false
      props.cancelDialog()
    }
    
    watch(props, (newVal, oldVal) => {
      if(newVal.dialogShow) cash('#global-confirm-modal').modal('show')
      else cash('#global-confirm-modal').modal('hide')
    })

    onMounted(() => {
      cash(dialogRef.value).on('click', function(event) {
        if ( cash(event.target).hasClass("modal") && cash(event.target).hasClass("show")) {
          if (cash(event.target).data("backdrop") === undefined) {
            props.cancelDialog()
          }
        }
      })

      if(props.dialogShow) cash('#global-confirm-modal').modal('show')
    })
    return { confirm, loading, props, dialogRef }
  },
}
</script>

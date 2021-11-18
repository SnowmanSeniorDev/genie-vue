<template>
  <signature-pad
    :modelValue='signatureFile'
    @input='onInput'
    :height='150'
    :customStyle="{ border: 'gray 1px solid', borderRadius: '25px', width: '100%' }"
    saveType='image/png'
    saveOutput='file'
    ref='signaturePad' />
  <div class='grid grid-cols-3 grid-flow-row gap-4 mt-2'>
    <button @click='undoSignature' class='btn btn-warning'>Undo signature</button>
    <button @click='clearSignature' class='btn btn-danger'>Clear signature</button>
  </div>
</template>

<script>
import { ref } from 'vue'
import SignaturePad from 'vue3-signature-pad'

export default {
  props: {
    signature: {
      require: true
    }
  },
  components: {
    SignaturePad
  },
  setup(props, context) {
    const signaturePad = ref(null)
    const signatureFile = ref(null)
    const signatureDataURL = ref(null)
    
    const getSignaturePad = () => {
      if (!signaturePad.value) {
        throw new Error('No signature pad ref could be found')
      }
      return signaturePad.value
    }

    const undoSignature = () => {
      getSignaturePad().undoSignature()
      saveSignature()
    }

    const clearSignature = () => {
      getSignaturePad().clearSignature()
      saveSignature()
    }    

    const saveSignature = async () => {
      const signature = getSignaturePad().saveSignature()
      console.log(signature)
      if(!signature.isEmpty) {
        context.emit('update:modelValue', signature)
        console.log(props.signature)
      }
    }

    const onInput = (value) => {
      if (!value) {
        signatureDataURL.value = null
        signatureFile.value = null
      } else if (value instanceof File) {
        signatureDataURL.value = null
        signatureFile.value = value
      } else {
        signatureDataURL.value = value
        signatureFile.value = null
      }

      saveSignature()
    }

    return {
      signaturePad,
      signatureFile,
      undoSignature,
      clearSignature,
      onInput
    }
  },
}
</script>
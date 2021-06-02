<template>
  <div>
    123
  </div>
</template>

<script>
export default {
  mounted(){
    this.$utils.showLoading(true)
    setTimeout(()=>{
      this.$utils.showLoading(false)
    },2000)
  }
}
</script>
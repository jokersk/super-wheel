<template>
    <div ref="wrapper" >
        <div style="height: 3000px; background: lightpink; position: relative;">
            <div style="position: sticky; top: 0px;">
                {{  count }}
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import SuperWheel from '../dist/super-wheel.mjs'

const wrapper = ref(null)
const count = ref(0)

onMounted(() => {
     SuperWheel.create(wrapper.value)
     SuperWheel.in(0.5, 0.7)
     .do(e => count.value = e).otherwise(() => {
         count.value = 0
     })
})
</script>

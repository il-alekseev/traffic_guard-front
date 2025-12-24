<template>
  <div class="heatmap-wrapper">
    <ClientOnly>
      <VueApexCharts type="heatmap" :options="chartOptions" :series="series" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'

type HeatmapValue = number

type Props = {
  days: string[]
  months: string[]
  values: HeatmapValue[][]
}

const props = defineProps<Props>()

type HeatmapSeries = {
  name: string
  data: number[]
}[]

const chartOptions = ref<ApexOptions>({
  chart: {
    type: 'heatmap',
    toolbar: { show: false }
  },

  plotOptions: {
    heatmap: {
      shadeIntensity: 1,
      distributed: false,
      radius: 2,
      useFillColorAsStroke: false,
      colorScale: {
        ranges: [
          { from: 0, to: 1, color: '#EFF6FF' },
          { from: 2, to: 3, color: '#93C5FD' },
          { from: 4, to: 5, color: '#3B82F6' },
          { from: 6, to: 999999, color: '#1E40AF' }
        ]
      }
    }
  },

  dataLabels: { enabled: false },

  xaxis: {
    categories: props.months,
    position: 'top'
  },
  yaxis: {
    labels: {
      show: true
    }
  },

  grid: { padding: { top: 0 } },
  legend: { show: false }
})

const series = ref<HeatmapSeries>([])

onMounted(() => {
  series.value = props.days.map((day, i) => ({
    name: day,
    data: props.values[i]
  }))
})
</script>

<style lang="scss" scoped>
.heatmap-wrapper {
  width: 100%;

  .apexcharts-heatmap-rect {
    rx: 2px;
    ry: 2px;
    width: 1rem;
    height: 1rem;
  }
}
</style>

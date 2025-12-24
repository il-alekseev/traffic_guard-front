<template>
  <div class="heatmap">
    <div class="heatmap__graph">
      <ClientOnly>
        <VueApexCharts type="heatmap" :options="chartOptions" :series="series" />
      </ClientOnly>
    </div>
    <div class="heatmap__legend">
      <div class="heatmap__legend-extremum-values">
        >{{ extremumValues.min }}
      </div>
      <div class="heatmap__legend-color-block heatmap__legend-color-block_1-level"></div>
      <div class="heatmap__legend-color-block heatmap__legend-color-block_2-level"></div>
      <div class="heatmap__legend-color-block heatmap__legend-color-block_3-level"></div>
      <div class="heatmap__legend-color-block heatmap__legend-color-block_4-level"></div>
      <div class="heatmap__legend-extremum-values">
        <{{ extremumValues.min }}
      </div>
    </div>
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

const props = defineProps<Props>();

type HeatmapSeries = {
  name: string
  data: number[]
}[];

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
});

const series = ref<HeatmapSeries>([]);

const extremumValues = computed(() => {
  const dataSource = series.value.length > 0 
    ? series.value.map(s => s.data) 
    : props.values;
  
  if (!dataSource || dataSource.length === 0) {
    return { min: 0, max: 0 };
  }
  
  let min = Infinity;
  let max = -Infinity;
  
  for (const row of dataSource) {
    for (const value of row) {
      if (value < min) min = value;
      if (value > max) max = value;
    }
  }
  
  if (min === Infinity || max === -Infinity) {
    return { min: 0, max: 0 };
  }
  
  return { min, max };
});

onMounted(() => {
  series.value = props.days.map((day, i) => ({
    name: day,
    data: props.values[i]
  }))
})
</script>

<style lang="scss" scoped>
.heatmap {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;

  &__graph {
    .apexcharts-heatmap-rect {
      rx: 2px;
      ry: 2px;
      width: 1rem;
      height: 1rem;
    }
  }

  &__legend {
    margin-left: auto;
    display: flex;
    gap: 0.625rem;
    align-items: center;

    &-extremum-values {
      font-size: 0.8125rem;
      line-height: 1.25rem;
      font-weight: 400;
      color: #A1A1AA;
    }

    &-color-block {
      border-radius: 4px;
      width: 1.25rem;
      height: 1.25rem;

      &_1-level {
        color: #EFF6FF;
      }
      &_2-level {
        color: #93C5FD;
      }
      &_3-level {
        color: #3B82F6;
      }
      &_4-level {
        color: #1E40AF;
      }      
    }
  }
}
</style>

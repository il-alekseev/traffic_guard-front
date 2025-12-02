<template>
  <div>
    <ClientOnly>
      <VueApexCharts
        width="100%"
        type="bar"
        :height="props.height"
        :options="chartOptions"
        :series="series"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import type { Categories } from '~/types/categories';
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'
import { computed } from 'vue';

const props = defineProps<{
  data: { name: Categories; value: number; color: string }[];
  height: string
}>();

const series = computed(() => [
  {
    name: "",
    data: safeData.value.data,
  },
]);

const safeData = computed(() => ({
  categories: props.data.map((i) => i.name) ?? [],
  colors: props.data.map((i) => i.color) ?? [],
  data: props.data.map((i) => i.value) ?? [],
}))


const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
  },

  plotOptions: {
    bar: {
      distributed: true,
      horizontal: false,
      borderRadius: 6,
      columnWidth: '50%',
    },
  },

  colors: safeData.value.colors,

  xaxis: {
    categories: safeData.value.categories,
    labels: { show: false },
    axisTicks: { show: false },
    axisBorder: { show: false },
  },

  dataLabels: {
    enabled: false,
  },

  tooltip: {
    y: {
      title: {
        formatter: () => "",
      },
    },
    x: {
      formatter: (_: any, opts: any) => props.data[opts.dataPointIndex].name,
    },
  },

  yaxis: {
    labels: {
      formatter: (value: number) => Math.round(value).toString(),
    },
  },

  legend: { show: false },
}));
</script>

<style lang="scss">
</style>

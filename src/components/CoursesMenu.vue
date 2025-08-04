<script setup>
let courses = [
	{
		"name": "Ottimizzazione combinatoria",
	},
	{
		"name": "Linguaggi di programmazione",
	},
	{
		"name": "Probabilità e statistica",
	},
];
</script>

<template>
  <h1>
	  StudyFlow
  </h1>
  <div>
	  <h3 v-if="courses">
		  Your courses:
	  </h3>
	  <h3 v-else>
		  No courses yet!
	  </h3>
	  <div class="d-flex flex-column">
		  <button v-for="course in courses" class="card my-2">
			  {{ course.name }}
		  </button>
	  </div>
	  <button class="btn btn-outline-dark my-2" @click="">
		  Aggiungi un corso
	  </button>
  </div>
</template>

<style scoped>
</style>

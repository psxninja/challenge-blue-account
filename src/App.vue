<template>
	<MainHeader />
	<main>
		<BoxTemperature city="Nuuk, GL" lat="64.1835" lon="-51.7216" />
		<BoxTemperature city="Urubici, BR" lat="-28.015" lon="-49.5917" info />
		<BoxTemperature city="Nairobi, KE" lat="-1.2833" lon="36.8167" />
	</main>
</template>

<script>
import BoxTemperature from './components/BoxTemperature.vue'
import MainHeader from './components/MainHeader.vue'

export default {
	name: 'App',
	components: {
		MainHeader,
		BoxTemperature
	}
}
</script>

<style>
main {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 50px;
	width: 100%;
	height: calc(100% - 55px);
}

@media (max-width: 900px) {
	main {
		flex-direction: column;
		justify-content: flex-start;
		padding: 50px 0;
		overflow: auto;
	}

	.boxTemperature:nth-child(1) {
		order: 1;
	}
	.boxTemperature:nth-child(3) {
		order: 2;
	}
}
</style>

<template>
	<div class="boxTemperature">
		<h2 class="boxTemperature__h2">{{ city }}</h2>
		<span class="boxTemperature__temp" v-bind:class="SensationTemp">
			{{ showTemperature }}
		</span>
		<div v-if="info" class="boxTemperature__info">
			<div>
				<span class="boxTemperature__infoSpan">Humidity</span>
				<span class="boxTemperature__infoSpanUnit" data-unit="%">
					{{ humidity }}
				</span>
			</div>
			<div>
				<span class="boxTemperature__infoSpan">Pressure</span>
				<span class="boxTemperature__infoSpanUnit" data-unit="hPa">
					{{ pressure }}
				</span>
			</div>
		</div>
		<div class="boxTemperature__info">
			<span class="boxTemperature__infoSpan boxTemperature__infoSpan--footer">
				Updated at {{ updatedAt }}
			</span>
		</div>
		<div class="loading" v-if="temperature === null">
			<img class="loading__loader" alt="Loading..." src="../assets/img/loader.svg" />
		</div>
		<div class="tryAgain" v-if="updatedAt === 'error'">
			<p class="tryAgain__p">Something went wrong</p>
			<button class="tryAgain__btn" type="button" v-on:click="Temp()">
				Try Again
			</button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'BoxTemperature',
	props: {
		city: String,
		lat: String,
		lon: String,
		info: Boolean
	},
	data() {
		return {
			temperature: null,
			humidity: 0,
			pressure: 0,
			updatedAt: '',
			updatedTime: 0
		}
	},
	methods: {
		timeout(ms) {
			return new Promise((resolve) => setTimeout(resolve, ms))
		},
		async getTempApi() {
			const temperatureFromApi = await fetch(
				`https://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.lon}&units=metric&appid=85f2902a03ff5c5007a26e2704a2ccce`
			)
			const temperatureData = await temperatureFromApi.json()

			temperatureData.status =
				temperatureFromApi.status !== undefined
					? temperatureFromApi.status
					: temperatureData.status

			return temperatureData
		},
		async getTemperature() {
			const temperatureCache = localStorage.getItem(this.lat + this.lon)
			const temperatureData = temperatureCache ? JSON.parse(temperatureCache) : false
			const updatedTime = new Date().getTime()

			if (temperatureCache) {
				const minuteTimeDiff = parseInt(
					((updatedTime - temperatureData.updatedTime) / (1000 * 60)) % 60
				)

				if (minuteTimeDiff < 10) {
					if (this.temperature !== null) return

					this.temperature = temperatureData.temperature
					this.pressure = temperatureData.pressure
					this.humidity = temperatureData.humidity
					this.updatedAt = temperatureData.updatedAt
					this.updatedTime = temperatureData.updatedTime
					return
				}
			}

			this.temperature = null

			await this.timeout(2000)

			const temperatureFromApi = await this.getTempApi()

			if (temperatureFromApi.status === 200) {
				const tempData = {
					temperature: temperatureFromApi.main.temp.toFixed(0),
					pressure: temperatureFromApi.main.pressure.toFixed(0),
					humidity: temperatureFromApi.main.humidity.toFixed(0),
					updatedAt: new Date().toLocaleTimeString({
						timeZoneName: 'short'
					}),
					updatedTime: updatedTime
				}

				localStorage.setItem(this.lat + this.lon, JSON.stringify(tempData))

				this.temperature = tempData.temperature
				this.pressure = tempData.pressure
				this.humidity = tempData.humidity
				this.updatedAt = tempData.updatedAt
				this.updatedTime = updatedTime
			} else {
				this.updatedAt = 'error'
			}
		},
		Temp() {
			const lat = parseFloat(this.lat)
			const lon = parseFloat(this.lon)

			if (isNaN(lat) || isNaN(lon)) {
				this.updatedAt = 'error'
				return
			}

			this.getTemperature()
			setInterval(this.getTemperature, 5000)
		}
	},
	computed: {
		SensationTemp() {
			if (this.temperature <= 5) return 'boxTemperature__temp--cold'
			if (this.temperature > 5 && this.temperature <= 25)
				return 'boxTemperature__temp--normal'
			if (this.temperature > 25) return 'boxTemperature__temp--high'
			return ''
		},
		showTemperature() {
			return this.temperature === null ? 0 : this.temperature
		}
	},
	mounted() {
		this.Temp()
	}
}
</script>

<style>
.boxTemperature {
	position: relative;
	display: block;
	width: 250px;
	cursor: default;
	background: #ffffff;
	box-shadow: var(--box-shadow);
	border-radius: 4px;
	text-align: center;
}
.boxTemperature__h2 {
	border-bottom: 1px solid var(--divider);
	height: 40px;
	line-height: 40px;
	font-size: 2rem;
	text-align: center;
	font-weight: normal;
}
.boxTemperature__temp {
	position: relative;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: 140px;
	font-size: 9rem;
	font-weight: 600;
}
.boxTemperature__temp::after {
	content: '\00B0';
	position: absolute;
	top: 1.5rem;
	right: -2rem;
	font-size: 5rem;
}
.boxTemperature__temp--cold {
	color: var(--text-temperature-cold);
}
.boxTemperature__temp--normal {
	color: var(--text-temperature-normal);
}
.boxTemperature__temp--high {
	color: var(--text-temperature-high);
}
.boxTemperature__info {
	display: flex;
	justify-content: space-around;
	align-items: center;
	background: var(--bg-card-footer);
	font-size: 2rem;
}
.boxTemperature__infoSpan {
	display: block;
	padding: 10px 10px 0;
	text-transform: uppercase;
	font-size: 1.2rem;
	color: var(--text-secondary);
}
.boxTemperature__infoSpan--footer {
	text-transform: inherit;
	padding: 5px 10px 10px;
}
.boxTemperature__infoSpanUnit::after {
	content: attr(data-unit);
	font-size: 1.3rem;
}
.loading {
	position: absolute;
	top: 40px;
	left: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: calc(100% - 40px);
	z-index: 10;
	background: #ffffff;
}
.tryAgain {
	position: absolute;
	top: 40px;
	left: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	width: 100%;
	height: calc(100% - 40px);
	z-index: 10;
	background: #ffffff;
}
.tryAgain__p {
	padding: 0 0 25px;
	font-weight: 500;
	font-size: 1.6rem;
	color: var(--text-went-wrong);
}
.tryAgain__btn {
	-moz-appearance: inherit;
	-webkit-appearance: inherit;
	width: 100px;
	height: 40px;
	cursor: pointer;
	background: none;
	border: 2px solid var(--text-primary);
	border-radius: 40px;
	font-weight: 500;
	font-size: 1.6rem;
	color: var(--text-primary);
}
</style>

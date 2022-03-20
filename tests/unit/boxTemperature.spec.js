import BoxTemperature from '@/components/BoxTemperature'
import { mount } from '@vue/test-utils'

const timeout = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

function setupFetchStub(data) {
	return function fetchStub(_url) {
		return new Promise((resolve) => {
			resolve({
				json: () => Promise.resolve(data)
			})
		})
	}
}

describe('Box temperature tests', () => {
	it('Display error when Lat and Lon is not a number', async () => {
		const wrapper = mount(BoxTemperature, {
			propsData: {
				city: 'Nuuk, GL',
				lat: 'Hello',
				lon: 'World'
			}
		})

		await wrapper.vm.$nextTick()

		expect(wrapper.text()).toContain('Nuuk, GL0 Updated at error')
	})

	it('Load temperature from api', async () => {
		const wrapper = mount(BoxTemperature, {
			propsData: {
				city: 'Nuuk, GL',
				lat: '64.1835',
				lon: '-51.7216'
			}
		})

		global.fetch = jest.fn().mockImplementation(
			setupFetchStub({
				main: {
					temp: 29.93,
					pressure: 1016,
					humidity: 28
				},
				status: 200
			})
		)

		await wrapper.vm.$nextTick()
		await timeout(2000)
		await wrapper.vm.$nextTick()

		expect(wrapper.text()).not.toContain('Nuuk, GL0 Updated at')

		global.fetch.mockClear()
		global.fetch = null
		delete global.fetch
	})

	it('Temperatures equal to or below 5 degrees should be displayed in blue.', async () => {
		const wrapper = mount(BoxTemperature, {
			propsData: {
				city: 'Urubici, BR',
				lat: '-28.015',
				lon: '-49.5917'
			}
		})

		global.fetch = jest.fn().mockImplementation(
			setupFetchStub({
				main: {
					temp: 5,
					pressure: 1016,
					humidity: 28
				},
				status: 200
			})
		)

		await wrapper.vm.$nextTick()
		await timeout(2000)
		await wrapper.vm.$nextTick()

		const temp = wrapper.find('.boxTemperature__temp')

		expect(temp.element.classList[1]).toBe('boxTemperature__temp--cold')

		global.fetch.mockClear()
		global.fetch = null
		delete global.fetch
	})

	it('Temperatures above 5 degrees and equal to or below 25 should be displayed in orange.', async () => {
		const wrapper = mount(BoxTemperature, {
			propsData: {
				city: 'Urubici, BR',
				lat: '-28.016',
				lon: '-49.5917'
			}
		})

		global.fetch = jest.fn().mockImplementation(
			setupFetchStub({
				main: {
					temp: 10,
					pressure: 1016,
					humidity: 28
				},
				status: 200
			})
		)

		await wrapper.vm.$nextTick()
		await timeout(2000)
		await wrapper.vm.$nextTick()

		const temp = wrapper.find('.boxTemperature__temp')

		expect(temp.element.classList[1]).toBe('boxTemperature__temp--normal')

		global.fetch.mockClear()
		global.fetch = null
		delete global.fetch
	})

	it('Temperatures above 25 degrees should be displayed in red.', async () => {
		const wrapper = mount(BoxTemperature, {
			propsData: {
				city: 'Urubici, BR',
				lat: '-28.316',
				lon: '-49.5913'
			}
		})

		global.fetch = jest.fn().mockImplementation(
			setupFetchStub({
				main: {
					temp: 26,
					pressure: 1016,
					humidity: 28
				},
				status: 200
			})
		)

		await wrapper.vm.$nextTick()
		await timeout(2000)
		await wrapper.vm.$nextTick()

		const temp = wrapper.find('.boxTemperature__temp')

		expect(temp.element.classList[1]).toBe('boxTemperature__temp--high')

		global.fetch.mockClear()
		global.fetch = null
		delete global.fetch
	})
})

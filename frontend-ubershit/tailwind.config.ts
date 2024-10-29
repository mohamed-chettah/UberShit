import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
    theme: {
        extend: {
            colors: {
                'bull-shot': {
                    '50': '#fef4e8',
                    '100': '#fee2c3',
                    '200': '#fec78a',
                    '300': '#fda747',
                    '400': '#fa8e15',
                    '500': '#ea8008',
                    '600': '#ca6d04',
                    '700': '#a15907',
                    '800': '#854d0e',
                    '900': '#714412',
                    '950': '#422606',
                },

            }
        }
    }
}

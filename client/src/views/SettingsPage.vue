<template>
    <div>
        <input type="file" ref="fileInput" @change="handleFileChange" accept=".json" />
        <button @click="loadFile">Load File</button>
        <div v-if="jsonData">
            <h2>Loaded JSON Data:</h2>
            <pre>{{ jsonData }}</pre>
        </div>
    </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import initService from '../services/initService';
export default {
    data() {
        return {
            jsonData: null
        };
    },
    methods: {
        handleFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const jsonData = JSON.parse(reader.result);
                        this.jsonData = jsonData;
                    } catch (error) {
                        console.error('Error parsing JSON file:', error);
                    }
                };
                reader.readAsText(file);
            }
        },
     loadFile() {
           initService.getInit(this.jsonData)
            .then(() => {
                toast('Products uploaded', { autoClose: 1000 })
            })
            .catch(() => {
                toast('Error', { autoClose: 1000 })
            });
        }
    }
};
</script>

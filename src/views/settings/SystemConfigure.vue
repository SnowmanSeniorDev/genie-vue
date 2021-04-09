<template>
  <div class="intro-y col-span-12 lg:col-span-6">
    <h2 class="intro-y text-lg font-medium mt-10">System Configure</h2>
    <div
      class="flex box items-center px-5 py-5 sm:py-0 border-b border-gray-200 dark:border-dark-5 mt-5"
    >
      <div class="dropdown ml-auto sm:hidden">
        <a
          class="dropdown-toggle w-5 h-5 block"
          href="javascript:;"
          aria-expanded="false"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-more-horizontal w-5 h-5 text-gray-600 dark:text-gray-300 w-5 h-5 text-gray-600 dark:text-gray-300"
          >
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="19" cy="12" r="1"></circle>
            <circle cx="5" cy="12" r="1"></circle>
          </svg>
        </a>
        <div class="nav nav-tabs dropdown-menu w-40" role="tablist">
          <div class="dropdown-menu__content box dark:bg-dark-1 p-2">
            <a
              v-for="(item, itemKey) in configurations"
              :key="itemKey"
              :id="`configurations-tab` + itemKey"
              href="javascript:;"
              data-toggle="tab"
              :data-target="`#configurations-tabpanel` + itemKey"
              class="block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
              role="tab"
              aria-controls="latest-tasks-new"
              aria-selected="true"
            >
              {{ item.configurationGroupName }}
            </a>
          </div>
        </div>
      </div>
      <div class="nav nav-tabs hidden sm:flex" role="tablist">
        <a
          v-for="(item, itemKey) in configurations"
          :key="itemKey"
          :id="`configurations-tab` + itemKey"
          data-toggle="tab"
          :data-target="`#configurations-tabpanel` + itemKey"
          href="javascript:;"
          :class="itemKey === 0 ? 'py-5 active' : 'py-5 ml-6'"
          role="tab"
          aria-selected="true"
        >
          {{ item.configurationGroupName }}
        </a>
      </div>
    </div>
    <div class="pt-5">
      <div class="tab-content">
        <div
          v-for="(item, itemKey) in configurations"
          :key="itemKey"
          :id="`configurations-tabpanel` + itemKey"
          :class="itemKey === 0 ? 'tab-pane active' : 'tab-pane'"
          role="tabpanel"
          :aria-labelledby="`configurations-tab` + itemKey"
        >
          <div class="grid grid-cols-12 gap-6 mt-5">
            <div
              v-for="(configuration, configKey) in item.configurations"
              :key="configKey"
              class="box intro-y col-span-12 md:col-span-6 lg:col-span-4 px-4"
            >
              <div
                v-for="(value, label) in configuration"
                :key="label + configKey"
                class="form-inline mt-5 last:mb-5"
              >
                <label
                  :for="`input-` + label + `-` + itemKey + `-` + configKey"
                  class="form-label sm:w-20"
                  >{{ label }}</label
                >
                <input
                  :id="`input-` + label + `-` + itemKey + `-` + configKey"
                  type="text"
                  class="form-control"
                  v-model="configurations[itemKey].configurations[configKey][label]"
                />
              </div>
              <div class="text-center lg:text-right p-2 mt-4 border-t border-gray-200 dark:border-dark-5">
                <button class="btn btn-elevated-primary py-1 px-2" @click="saveConfigurations(itemKey)">
                  Save
                </button>
                 <button class="btn btn-elevated-danger py-1 px-2 ml-2" @click="openDeleteConfigurationConfirmModal(itemKey, configKey)">
                  Remove
                </button>
              </div>
            </div>
            <button
              class="focus:outline-none rounded-lg intro-y col-span-12 md:col-span-6 lg:col-span-4 px-4 h-54 border-dashed border-4 border-gray-600"
              @click="addConfigurationModal(itemKey)"
            >
              <PlusIcon class="w-24 h-24 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- BEGIN: Add Configuration Modal Content -->
    <div id="add-configuration-modal" class="modal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- BEGIN: Modal Header -->
          <div class="modal-header">
            <h2 class="font-medium text-base mr-auto">Add Configuration</h2>
          </div>
          <!-- END: Modal Header -->
          <div class="m-8">
            <div class="intro-y col-span-12 md:col-span-6 lg:col-span-4 px-4">
              <div
                v-for="(value, label) in addConfigurationData"
                :key="label"
                class="form-inline mt-5 last:mb-5"
              >
                <label :for="label + '-add'" class="form-label sm:w-20">{{
                  label
                }}</label>
                <input
                  :id="label + `-add`"
                  type="text"
                  class="form-control"
                  v-model="addConfigurationData[label]"
                />
              </div>
            </div>
          </div>
          <div class="modal-footer text-right">
            <button type="button" data-dismiss="modal" class="btn btn-outline-secondary w-20 mr-1">
              Cancel
            </button>
            <button type="button" data-dismiss="modal" class="btn btn-primary w-20" @click="addConfigurationSave">
              OK
            </button>
          </div>
          <!-- END: Modal Footer -->
        </div>
      </div>
    </div>
    <!-- END: Add Configuration Modal Content -->
    <!-- BEGIN: Delete Configuration Confirm Modal Content -->
    <div id="delete-configuration-confirm-modal" class="modal" tabindex="-1" aria-hidden="true">
     <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-body p-0">
            <div class="p-5 text-center">
              <XCircleIcon class="w-16 h-16 text-theme-6 mx-auto mt-3" />
              <div class="text-3xl mt-5">Are you sure?</div>
              <div class="text-gray-600 mt-2"> Do you really want to delete? <br />This process cannot be undone. </div>
            </div>
            <div class="px-5 pb-8 text-center">
              <button type="button" data-dismiss="modal" class="btn btn-outline-secondary w-24 dark:border-dark-5 dark:text-gray-300 mr-1"> Cancel </button>
              <button type="button" class="btn btn-danger w-24" @click="deleteConfiguration"> Delete </button>
            </div>
          </div>
        </div>
     </div>
    </div>
    <!-- END Delete Role Confirm Modal Content-->
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import Https from "@/plugins/axios";
// import _ from "lodash";
import { helper as $h } from "@/utils/helper";

export default {
  setup() {
    const configurations = ref([]);
    const addConfigurationData = ref(null);
    const addConfigurationGroupName = ref(null);
    const addConfigurationItemKey = ref(null);
    const deleteConfigurationData = ref(null);
    const deleteConfigurationDataGroupName = ref("");

    const getConfigurations = () => {
      const api = "configuration/v1";
      Https.get(api).then((res) => {
        configurations.value = res.data;
        console.log("asdf = ", configurations.value);
      });
    };

    const saveConfigurations = (itemKey) => {
      console.log(itemKey);
      console.log(configurations.value[itemKey])
      const api = `configuration/v1/${configurations.value[itemKey].configurationGroupName}`;
      Https.put(api, configurations.value[itemKey].configurations).then(res => {
        if(res === 200) getConfigurations()
      })
    }

    const addConfigurationModal = (itemKey) => {
      addConfigurationData.value = $h.removeObjectValues(configurations.value[itemKey].configurations[0]);
      addConfigurationGroupName.value = configurations.value[itemKey].configurationGroupName;
      addConfigurationItemKey.value = itemKey
      cash("#add-configuration-modal").modal("show");
    };

    const addConfigurationSave = () => {
      const api = `configuration/v1/${addConfigurationGroupName.value}`;
      Https.put(api, [...configurations.value[addConfigurationItemKey.value].configurations, addConfigurationData.value]).then(res => {
        if(res.status === 200) {
          getConfigurations();
          cash("#add-configuration-modal").modal("hide");
        }
      })
    };

    const openDeleteConfigurationConfirmModal = (itemKey, configKey) => {
      deleteConfigurationDataGroupName.value = configurations.value[itemKey].configurationGroupName;
      deleteConfigurationData.value = configurations.value[itemKey].configurations.filter((item, key) => {
        return configKey !== key;
      })
      cash("#delete-configuration-confirm-modal").modal("show");
    }

    const deleteConfiguration = () => {
      const api = `configuration/v1/${deleteConfigurationDataGroupName.value}`;
      Https.put(api, deleteConfigurationData.value).then(res => {
        if(res.status === 200) {
          getConfigurations();
          cash("#delete-configuration-confirm-modal").modal("hide");
        }
      })
    }

    onMounted(() => {
      getConfigurations();
    });
    return {
      configurations,
      addConfigurationData,
      saveConfigurations,
      addConfigurationModal,
      addConfigurationSave,
      openDeleteConfigurationConfirmModal,
      deleteConfiguration,
    };
  },
};
</script>

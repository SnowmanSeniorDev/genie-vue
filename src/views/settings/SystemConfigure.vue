<template>
  <div class="intro-y col-span-12 lg:col-span-6">
    <h2 class="intro-y text-lg font-medium mt-10">System Configure</h2>
    <div class="flex box items-center px-5 py-5 sm:py-0 border-b border-gray-200 dark:border-dark-5 mt-5">
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
              :id="`configurations-tab` + itemKey"
              :key="itemKey"
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
          :id="`configurations-tab` + itemKey"
          :key="itemKey"
          data-toggle="tab"
          :data-target="`#configurations-tabpanel` + itemKey"
          href="javascript:;"
          :class="itemKey === 0 ? 'py-5 active' : 'py-5 ml-6'"
          role="tab"
          aria-selected="true"
          @click="setAddConfigurationGroup(item.configurationGroupName, itemKey)"
        >
          {{ item.configurationGroupName }}
        </a>
        <div class="self-center ml-5">
          <button class="btn btn-primary btn-sm" @click="openAddNewGroupModal"><PlusIcon class="w-4 h-4 mr-1" />Add New Group</button>
        </div>
      </div>
    </div>
    <div class="pt-5">
      <div class="tab-content">
        <div
          v-for="(item, itemKey) in configurations"
          :id="`configurations-tabpanel` + itemKey"
          :key="itemKey"
          :class="itemKey === 0 ? 'tab-pane active' : 'tab-pane'"
          role="tabpanel"
          :aria-labelledby="`configurations-tab` + itemKey"
        >
          <div class="grid grid-cols-12 gap-6 mt-5">
            <div v-for="(configuration, configKey) in item.configurations" :key="configKey" class="box intro-y col-span-12 md:col-span-6 lg:col-span-4 px-4">
              <div class="form-inline mt-5 last:mb-5">
                <label :for="`input-name` + `-` + itemKey + `-` + configKey" class="form-label sm:w-20">name</label>
                <input :id="`input-name` + `-` + itemKey + `-` + configKey" v-model="configurations[itemKey].configurations[configKey].name" type="text" class="form-control"/>
              </div>
              <div class="form-inline mt-5 last:mb-5">
                <label for="add-input-value" class="form-label sm:w-20">value</label>
                <ArrayInput v-if="configurations[itemKey].configurations[configKey].dataType === 'Array'" v-model="configurations[itemKey].configurations[configKey].value"/>
                <input v-else id="add-input-value" v-model="configurations[itemKey].configurations[configKey].value" type="text" class="form-control"/>
              </div>
              <div class="form-inline mt-5 last:mb-5">
                <label :for="`input-dataType` + `-` + itemKey + `-` + configKey" class="form-label sm:w-20">data type</label>
                <div class="dropdown inline-block" data-placement="bottom">
                  <button class="dropdown-toggle btn btn-sm btn-primary w-32 mr-1 mb-2" aria-expanded="false"> {{ configurations[itemKey].configurations[configKey].dataType }} </button>
                  <div class="dropdown-menu w-40">
                    <div class="dropdown-menu__content box dark:bg-dark-1 p-2">
                      <a 
                        href="javascript:;"
                        class="block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                        @click="changeDataType(itemKey, configKey, 'String')"
                      >
                        String
                      </a>
                      <a 
                        href="javascript:;"
                        class="block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                        @click="changeDataType(itemKey, configKey, 'Numeric')"
                      >
                        Numeric
                      </a>
                      <a
                        href="javascript:;"
                        class="block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                        @click="changeDataType(itemKey, configKey, 'Array')"
                      >
                        Array
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="text-center lg:text-right p-2 mt-4 border-t border-gray-200 dark:border-dark-5">
                <button class="btn btn-elevated-primary py-1 px-2" @click="saveConfigurations(itemKey)">Save</button>
                 <button class="btn btn-elevated-danger py-1 px-2 ml-2" @click="openDeleteConfigurationConfirmModal(itemKey, configKey)">Remove</button>
              </div>
            </div>
            <button
              class="focus:outline-none rounded-lg intro-y col-span-12 md:col-span-6 lg:col-span-4 px-4 h-54 border-dashed border-4 border-gray-600"
              @click="addConfigurationModal"
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
              <div class="form-inline mt-5 last:mb-5">
                <label for="add-input-name" class="form-label sm:w-20">name</label>
                <input id="add-input-name" v-model="addConfigurationData.name" type="text" class="form-control"/>
              </div>
              <div class="form-inline mt-5 last:mb-5">
                <label for="add-input-value" class="form-label sm:w-20">value</label>
                <ArrayInput v-if="addConfigurationData.dataType === 'Array'" v-model="addConfigurationData.value"/>
                <input v-else id="add-input-value" v-model="addConfigurationData.value" type="text" class="form-control"/>
              </div>
              <div class="form-inline mt-5 last:mb-5">
                <label for="add-input-dataType" class="form-label sm:w-20">data type</label>
                <div class="dropdown inline-block" data-placement="bottom">
                  <button class="dropdown-toggle btn btn-sm btn-primary w-32 mr-1 mb-2" aria-expanded="false"> {{ addConfigurationData.dataType }} </button>
                  <div class="dropdown-menu w-40">
                    <div class="dropdown-menu__content box dark:bg-dark-1 p-2">
                      <a 
                        href="javascript:;"
                        class="block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                        @click="addChangeDataType('String')"
                      >
                        String
                      </a>
                      <a 
                        href="javascript:;"
                        class="block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                        @click="addChangeDataType('Numeric')"
                      >
                        Numeric
                      </a>
                      <a
                        href="javascript:;"
                        class="block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                        @click="addChangeDataType('Array')"
                      >
                        Array
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer text-right">
            <button type="button" data-dismiss="modal" class="btn btn-outline-secondary w-20 mr-1">Cancel</button>
            <button type="button" data-dismiss="modal" class="btn btn-primary w-20" @click="addConfigurationSave">Add</button>
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
    <!-- END Delete Role Confirm Modal Content -->
    <!-- BEGIN: Add New Group Modal Content -->
    <div id="add-new-group-modal" class="modal" tabindex="-1" aria-hidden="true">
     <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="font-medium text-base mr-auto">Add New Group</h2>
          </div>
          <!-- END: Modal Header -->
          <div class="m-8">
            <div class="intro-y col-span-12 md:col-span-6 lg:col-span-4 px-4">
              <div class="form-inline mt-5 last:mb-5">
                <label for="add-input-name" class="form-label sm:w-20">Group Name</label>
                <input id="add-input-name" v-model="addNewGroupName" type="text" class="form-control"/>
              </div>
              <div class="form-inline mt-5 last:mb-5">
                <label for="add-input-name" class="form-label sm:w-20">name</label>
                <input id="add-input-name" v-model="addConfigurationData.name" type="text" class="form-control"/>
              </div>
              <div class="form-inline mt-5 last:mb-5">
                <label for="add-input-value" class="form-label sm:w-20">value</label>
                <ArrayInput v-if="addConfigurationData.dataType === 'Array'" v-model="addConfigurationData.value"/>
                <input v-else id="add-input-value" v-model="addConfigurationData.value" type="text" class="form-control"/>
              </div>
              <div class="form-inline mt-5 last:mb-5">
                <label for="add-input-dataType" class="form-label sm:w-20">data type</label>
                <div class="dropdown inline-block" data-placement="bottom">
                  <button class="dropdown-toggle btn btn-sm btn-primary w-32 mr-1 mb-2" aria-expanded="false"> {{ addConfigurationData.dataType }} </button>
                  <div class="dropdown-menu w-40">
                    <div class="dropdown-menu__content box dark:bg-dark-1 p-2">
                      <a 
                        href="javascript:;"
                        class="block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                        @click="addChangeDataType('String')"
                      >
                        String
                      </a>
                      <a 
                        href="javascript:;"
                        class="block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                        @click="addChangeDataType('Numeric')"
                      >
                        Numeric
                      </a>
                      <a
                        href="javascript:;"
                        class="block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                        @click="addChangeDataType('Array')"
                      >
                        Array
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer text-right">
            <button type="button" data-dismiss="modal" class="btn btn-outline-secondary w-20 mr-1">Cancel</button>
            <button type="button" data-dismiss="modal" class="btn btn-primary w-20" @click="addNewGroup">Add</button>
          </div>
        </div>
      </div>
    </div>
    <!-- END Add New Group Modal Content -->
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { sysAxios } from "@/plugins/axios";

export default {
  setup() {
    const configurations = ref([]);
    const addConfigurationData = ref({ name: '', value: [], dataType: 'String' });
    const addConfigurationGroupName = ref(null);
    const addConfigurationItemKey = ref(null);
    const deleteConfigurationData = ref(null);
    const addNewGroupName = ref('');
    const deleteConfigurationDataGroupName = ref("");

    const getConfigurations = () => {
      const api = "configuration/v1";
      sysAxios.get(api).then((res) => {
        configurations.value = jsonDecodeArray(res.data);
      });
    };

    const jsonDecodeArray = (data) => {
      data.forEach((group, groupIndex) => {
        group.configurations.forEach((item, itemIndex) => {
          if(item.dataType === "Array") data[groupIndex].configurations[itemIndex].value = JSON.parse(item.value);
        })
      });

      return data
    }

    const jsonEncodeArray = (configurations) => {
      configurations.forEach((item, index) => {
        if(item.dataType === "Array") configurations[index].value = JSON.stringify(item.value);
      });

      return configurations
    }

    const addNewGroup = () => {
      const api = `configuration/v1/${addNewGroupName.value}`;
      console.log(addConfigurationData.value);
      sysAxios.post(api, jsonEncodeArray([addConfigurationData.value])).then((res) => {
        console.log(res)
        if(res.status === 201) getConfigurations();
      })
    }

    const saveConfigurations = (itemKey) => {
      console.log(itemKey);
      console.log(configurations.value[itemKey])
      const api = `configuration/v1/${configurations.value[itemKey].configurationGroupName}`;
      sysAxios.put(api, configurations.value[itemKey].configurations).then(res => {
        if(res === 200) getConfigurations()
      })
    }

    const addConfigurationModal = () => {
      cash("#add-configuration-modal").modal("show");
    };

    const openAddNewGroupModal = () => {
      cash("#add-new-group-modal").modal("show");
    }

    const addConfigurationSave = () => {
      console.log(addConfigurationData.value)
      const api = `configuration/v1/${addConfigurationGroupName.value}`;
      console.log(addConfigurationGroupName.value)
      console.log(addConfigurationItemKey.value);
      sysAxios.put(api, jsonEncodeArray([...configurations.value[addConfigurationItemKey.value].configurations, addConfigurationData.value])).then(res => {
        if(res.status === 200) {
          getConfigurations();
          cash("#add-configuration-modal").modal("hide");
        }
      })
    };

    const setAddConfigurationGroup = (groupName, groupKey) => {
      console.log(groupName)
      addConfigurationGroupName.value = groupName;
      addConfigurationItemKey.value = groupKey;
    }

    const addChangeDataType = (dataType) => {
      addConfigurationData.value.dataType = dataType
      cash(".dropdown-menu").dropdown("hide");
    }

    const openDeleteConfigurationConfirmModal = (itemKey, configKey) => {
      deleteConfigurationDataGroupName.value = configurations.value[itemKey].configurationGroupName;
      deleteConfigurationData.value = configurations.value[itemKey].configurations.filter((item, key) => {
        return configKey !== key;
      })
      cash("#delete-configuration-confirm-modal").modal("show");
    }

    const deleteConfiguration = () => {
      const api = `configuration/v1/${deleteConfigurationDataGroupName.value}`;
      sysAxios.put(api, deleteConfigurationData.value).then(res => {
        if(res.status === 200) {
          getConfigurations();
          cash("#delete-configuration-confirm-modal").modal("hide");
        }
      })
    }

    const changeDataType = (itemKey, configKey, dataType) => {
      configurations.value[itemKey].configurations[configKey].dataType = dataType;
      cash(".dropdown-menu").dropdown("hide");
    }

    onMounted(() => {
      getConfigurations();
    });
    return {
      configurations,
      openAddNewGroupModal,
      addNewGroupName,
      addNewGroup,
      addConfigurationData,
      saveConfigurations,
      addConfigurationModal,
      addConfigurationSave,
      addChangeDataType,
      setAddConfigurationGroup,
      openDeleteConfigurationConfirmModal,
      deleteConfiguration,
      changeDataType,
    };
  },
};
</script>

<template>
  <h2 class='intro-y text-lg font-medium mt-10'>Users Layout</h2>
  <!-- testing confirm modal -->
  <button class="btn btn-primary" @click="openDialog">open confirm dialog</button>
  <ConfirmDialog
    title='Testing dialog title'
    content='This is testing dialog content ....'
    :dialogShow='dialogShow'
    :callBack='modalConfirm'
    :cancelDialog='cancelDialog'
  />

  <!-- BEGIN: Users Layout -->
  <div class='intro-y box px-3 pb-3 mt-3 w-full'>
    <div v-if='companyLoading' class='py-16'>
      <div class='w-full h-8 px-8'>
        <LoadingIcon icon='spinning-circles' color='gray' class='w-4 h-4 py-8' />
      </div>
    </div>
    <div :class="`${companyLoading ? 'hidden' : 'block'}`" class='overflow-x-auto scrollbar-hidden'>
      <div id='tabulator' ref='tableRef' class='mt-5 table-report table-report--tabulator'></div>
    </div>
    
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { sysAxios, appAxios } from '@/plugins/axios'
import { useRouter } from 'vue-router'
import Tabulator from 'tabulator-tables'
import feather from 'feather-icons'
import _ from 'lodash'

export default {
  setup() {
    const companies = ref([])
    const router = useRouter()
    const tableRef = ref()
    const tabulator = ref()
    const companyLoading = ref(true)
    const approveRoleId = ref('')
    const dialogShow = ref(false)

    const modalConfirm = () => {
      return new Promise(resolve => {
        resolve('testing modal confirm promise call')
      })
    }

    const openDialog = () => dialogShow.value = true
    const cancelDialog = () => dialogShow.value = false

    const init = async () => {
      companyLoading.value = true
      
      var users = await sysAxios.get('user/v1/').then( res => {return res.data})
      await Promise.all(
        users.map( async user => {
          const authorizationApi = `access/v1/authorization/user/${user.userId}`
          const isGuest = await sysAxios.get(authorizationApi).then(authRes => {
            if(_.find(authRes.data.roles, {roleName: 'guest'})) return true
            else return false
          })

          if(isGuest) {
            const company_uuid = await appAxios.get(`company/v1/user/${user.userId}`).then(res => res.data)
            if(company_uuid !== '00000000-0000-0000-0000-000000000000') {
              const company = await appAxios.get(`company/v1/${company_uuid}/`).then(res => {return res.data})
              companies.value.push({...company, user})
            }
          }
        })
      )
      
      companyLoading.value = false
      initTabulator(companies.value)
      return new Promise(resolve => {
        resolve(companies.value)
      })
    }

    const initTabulator = (data) => {
      tabulator.value = new Tabulator(tableRef.value, {
        data: data,
        ajaxLoaderLoading: '<span>Loading Data</span>',
        pagination: 'local',
        paginationSize: 10,
        paginationSizeSelector: [5, 10, 20, 30, 40],
        layout: 'fitColumns',
        responsiveLayout: 'collapse',
        placeholder: 'No matching records found',
        columns: [
          {
            title: 'Registration No',
            field: 'registrationNo',
            minWidth: 50,
            maxWidth: 200,
            hozAlign: 'left',
            resizable: true,
            headerSort: false
          }, {
            title: 'Company Name',
            field: 'companyDisplayName',
            resizable: false,
            headerSort: false
          }, {
            title: 'Company Legal Name',
            field: 'companyLegalName',
            headerHozAlign: 'center',
            hozAlign: 'center',
            resizable: true,
            headerSort: false
          }, {
            title: 'Address',
            field: 'addressLine1',
            headerHozAlign: 'center',
            hozAlign: 'center',
            resizable: true,
            headerSort: false
          }, {
            title: 'Type',
            field: 'companyType',
            headerHozAlign: 'center',
            hozAlign: 'center',
            resizable: true,
            headerSort: false
          }, {
            title: 'Phone',
            field: 'phone',
            minWidth: 100,
            maxWidth: 200,
            hozAlign: 'right',
            resizable: true,
            headerSort: true,
          }, {
            title: 'Email',
            field: 'primaryEmail',
            hozAlign: 'center',
            resizable: true,
            headerSort: false
          }, {
            title: 'ACTIONS',
            minWidth: 100,
            maxWidth: 150,
            responsive: 1,
            headerHozAlign: 'center',
            hozAlign: 'center',
            vertAlign: 'middle',
            formatter(cell) {
              const a = cash(`<div class='flex lg:justify-center items-center'>
                <a class='flex items-center btn btn-sm btn-primary' href='javascript:;'>
                  Approve
                </a>
              </div>`)
              cash(a).on('click', function() {
                const userId = cell.getData().user.userId
                approveCompany(userId)
              })
              return a[0]
            }
          }
        ],
        renderComplete() {
          feather.replace({
            'stroke-width': 1.5
          })
        }
      })
    }

    const approveCompany = async userId => {
      const authorized_uuid = await sysAxios.get(`access/v1/authorization/user/${userId}`).then(res => {return res.data.authorizationId})
      sysAxios.put(`access/v1/authorization/${authorized_uuid}`, {applicationDomain: 'genie', roleIds: [approveRoleId.value]}).then(res => {
        if(res.status == 200) init()
      })
    }

    const gotoEdit = id => {
      router.push({path: `/users/edit/${id}`})
    }

    const deleteUser = (userid) => {
      const api = `user/v1/${userId}`
      sysAxios.delete(api).then(res => {
        if(res.status === 200) {
          _.remove(this.users, {userId: userId})
          console.log(this.users)
        }
      })
    }

    const reInitOnResizeWindow = () => {
      window.addEventListener('resize', () => {
        tabulator.value.redraw()
        feather.replace({
          'stroke-width': 1.5
        })
      })
    }

    onMounted(async () => {
      approveRoleId.value = await sysAxios.get('access/v1/role').then(res => {
        return _.find(res.data, {roleName: 'System Admin'}).roleId
      })
      await init()
      reInitOnResizeWindow()
    })

    return {
      tableRef,
      gotoEdit,
      deleteUser,
      companyLoading,
      modalConfirm,
      dialogShow,
      openDialog,
      cancelDialog
    }
  },
}
</script>

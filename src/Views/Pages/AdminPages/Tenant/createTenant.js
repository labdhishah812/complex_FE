import components from '../..';

const TenantCreate = () => {
    const { SelectButton, Image, Button, DataTable, Column, InputText, React, useNavigate, BreadCrumb, Toolbar, Paginator, useState, useEffect, useDispatch, useSelector } = components;
    const navigate = useNavigate();
    const { loginDetails } = useSelector((store) => store.auth);

    const breadcrumbHome = {
        label: 'Tenant',
        command: () => {
            navigate(`/property-management/tenant`);
        }
    };

    const breadcrumbItems = [
        {
            label: 'Assign Tenant'
        }
    ];
    // const getRoles = (permissionName) => {
    //     try {
    //         let checkPrmition = false;
    //         if (loginDetails) {
    //             loginDetails?.role_permissions.forEach((b, i) => {
    //                 let check = b.permission.find((x) => x.module_name === "user-property-assign")?.module_access.findIndex((y) => y === permissionName);
    //                 if (check !== undefined && check !== -1 && checkPrmition === false) {
    //                     checkPrmition = true;
    //                 }
    //             })
    //         }
    //         return checkPrmition;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    // const rightToolbarTemplate = () => {
    //     return (
    //         <React.Fragment>
    //             <SelectButton
    //                 // value={pagination.listType === 0 ? "all" : "myProperty"}
    //                 value={
    //                     pagination.listType === 0 ? "all" : "myProperty"
    //                 }
    //                 // value={"Active"}
    //                 optionLabel="name"
    //                 options={[
    //                     { name: 'My Property', value: "myProperty" },
    //                     { name: 'All Property', value: "all" },
    //                 ]}
    //                 onChange={(e) => {
    //                     let paginationData = { ...pagination }; // Create a shallow copy of the pagination object
    //                     paginationData.current_page = 1;
    //                     paginationData.per_page = 10;
    //                     paginationData.listType =
    //                         e.value === "all" ? 0 : 1;
    //                     // e.value === "myProperty" ? 1 :
    //                     //     e.value === "assigned" ? 2 :
    //                     //         e.value === "unassigned" ? 3 :
    //                     //             paginationData.listType; // Default to the current listType if no match

    //                     setPagination(paginationData); // Update the pagination state
    //                     // callPropertyList(paginationData); // Trigger the property list call
    //                 }}

    //                 // className='select_button_custome mr-3'
    //                 className='mr-3'
    //             />
    //             {getRoles("create") && <Button
    //                 label="Create Tenant"
    //                 icon="pi pi-plus"
    //                 className="p-button-outlined p-button-success mr-2"
    //                 onClick={() => {
    //                     navigate('/property-management/tenant/tenant-create');
    //                 }}
    //             />}
    //             {/* <Button icon="pi pi-plus" onClick={() => setModalExcel(!modalExcel)} label="Import Excel" chooseLabel="Import Excel" className="p-button-outlined p-button-help" /> */}
    //         </React.Fragment>
    //     );
    // };
    // const header = <Toolbar className="create-delete-btn" end={rightToolbarTemplate}></Toolbar>;
    return (
        <div className="relative min-h-full">
            <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Assign Tenant</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
            <div className="grid crud-demo ml-0 mr-0">
                <div className="col-12 card mt-2">
                    {/* <DataTable
                        value={[]}
                        showGridlines
                        stripedRows
                        dataKey="id"
                        // className="datatable-responsive"
                        emptyMessage="No Record Found."
                        header={header}
                        scroll="scroll"
                        tableStyle={{ minWidth: '60rem' }}
                        sortMode="multiple"
                        size="normal"
                    // onSort={(e) => {
                    //     let paginationData = { ...pagination };
                    //     paginationData.order_column = e.multiSortMeta[0]['field'];
                    //     paginationData.order_direction = e.multiSortMeta[0]['order'];
                    //     setPagination(paginationData);
                    //     setMultiSortMeta(e.multiSortMeta);
                    //     callRoleList(paginationData);
                    // }}
                    // multiSortMeta={multiSortMeta}
                    >

                    </DataTable> */}
                </div>
            </div>
        </div>
    );
};

export default TenantCreate;

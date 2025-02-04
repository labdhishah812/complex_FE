
import { useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import { getPropertyDetailsRequest } from '../../../redux/slice/AdminSlices/complexSlice';
import components from '..';

const SalesmanPropertyDetails = () => {
  const { id } = useParams();
  const { BreadCrumb, React, Divider, useSelector, useNavigate, useDispatch, useEffect } = components;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { complexData, loading, error } = useSelector((state) => state.complex);

  const breadcrumbHome = {
    // icon: 'pi pi-home',
    label: 'Property List',
    command: () => {
        navigate('/salesman/dashboard');
    }
};
const breadcrumbItems = [
    {
        label: 'Property Details'
        // command: () => {
        //     navigate('/superadmin/properties');
        // }
    }
];

  useEffect(() => {
    if (id) {
      dispatch(getPropertyDetailsRequest(id));
    }
  }, [dispatch, id]);

  // Icon mapping function
  const getIcon = (key) => {
    const iconMap = {
      property_name: 'pi pi-building',
      property_type: 'pi pi-th-large',
      property_status: 'pi pi-check-circle',
      property_city: 'pi pi-map-marker',
      pin_code: 'pi pi-map',
      property_logo: 'pi pi-image',
      is_block_exist_in_property: 'pi pi-table',
      is_floor_exist_in_property: 'pi pi-list',
      name: 'pi pi-user',
      email: 'pi pi-envelope',
      mobile_number: 'pi pi-mobile',
      chairman_id: 'pi pi-id-card',
      user_id: 'pi pi-user-plus',
      accountHolderName: 'pi pi-user-edit',
      bankName: 'pi pi-credit-card',
      bankAccountNumber: 'pi pi-wallet',
      branchName: 'pi pi-home',
      IFSCCode: 'pi pi-code',
      domainName: 'pi pi-globe',
      databaseName: 'pi pi-database',
      dbUrl: 'pi pi-server',
      tenantId: 'pi pi-key',
      subscriptionPlan: 'pi pi-bookmark',
      subscriptionStatus: 'pi pi-verified',
      billingCycle: 'pi pi-sync',
      created_at: 'pi pi-calendar-plus',
      updated_at: 'pi pi-calendar-times',
    };
    return iconMap[key] || 'pi pi-info-circle';
  };

  // Status color mapping function
  const getStatusSeverity = (status) => {
    const statusMap = {
      Active: 'success',
      Inactive: 'danger',
      Pending: 'warning',
      Basic: 'info',
      Premium: 'success',
      Standard: 'warning',
    };
    return statusMap[status] || 'info';
  };

  // Value formatting function
  const formatValue = (key, value) => {
    if (value === null || value === undefined || value === '') return '-';

    if (typeof value === 'boolean') return value ? 'Yes' : 'No';

    if (key === 'created_at' || key === 'updated_at') {
      return new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    if (key === 'property_status' || key === 'subscriptionStatus' || key === 'subscriptionPlan') {
      return (
        <Tag
          severity={getStatusSeverity(value)}
          value={value}
          rounded
        />
      );
    }

    if (key === 'property_logo') {
      return (
        <img
          src={value}
          alt="Property Logo"
          className="w-4rem h-4rem border-round shadow-2"
          onError={(e) => (e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')}
        />
      );
    }

    if (key === 'email') {
      return (
        <a
          href={`mailto:${value}`}
          className="text-primary hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {value}
        </a>
      );
    }

    return String(value);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center min-h-screen">
        <ProgressSpinner strokeWidth="3" animationDuration=".5s" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-content-center align-items-center min-h-screen">
        <div className="p-4 border-round surface-card shadow-2">
          <i className="pi pi-exclamation-circle text-red-500 text-2xl mb-2"></i>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  // No data state
  if (!complexData) {
    return (
      <div className="flex justify-content-center align-items-center min-h-screen">
        <div className="surface-card shadow-2 border-round p-4">
          <i className="pi pi-info-circle text-blue-500 text-2xl mb-2"></i>
          <p className="text-gray-500">No property data found.</p>
        </div>
      </div>
    );
  }

  // Header component
  const header = (
    <div className="surface-section p-4 flex align-items-center gap-4 border-bottom-1 surface-border">
      {complexData.property_logo && (
        <img
          src={complexData.property_logo}
          alt="Property Logo"
          className="w-5rem h-5rem border-round shadow-2"
          onError={(e) => (e.target.src = "https://property-management-tt.s3.ap-south-1.amazonaws.com/upload/property-logo/" + e.property_logo)}
        />
      )}
      <div>
        <h1 className="text-xl font-bold m-0 mb-2">{complexData.property_name}</h1>
        <div className="flex gap-3">
          <Tag severity={getStatusSeverity(complexData.property_status)} value={complexData.property_status} rounded />
          <Tag severity="info" value={complexData.property_type} rounded />
        </div>
      </div>
    </div>
  );

  // Field groups
  const fieldGroups = {
    'Property Information': {
      icon: 'pi pi-building',
      fields: ['property_name', 'property_type', 'property_status', 'property_city', 'pin_code', 'is_block_exist_in_property', 'is_floor_exist_in_property'],
    },
    'Contact Details': {
      icon: 'pi pi-user',
      fields: ['name', 'email', 'mobile_number', 'chairman_id', 'user_id'],
    },
    'Bank Information': {
      icon: 'pi pi-wallet',
      fields: ['accountHolderName', 'bankName', 'bankAccountNumber', 'branchName', 'IFSCCode'],
    },
    'Subscription Details': {
      icon: 'pi pi-ticket',
      fields: ['subscriptionPlan', 'subscriptionStatus', 'billingCycle'],
    },
    'System Details': {
      icon: 'pi pi-cog',
      fields: ['created_at', 'updated_at', 'domainName', 'databaseName'],
    },
  };

  // Main render
  return (

    <div className="p-4">
         <div className="flex justify-content-between align-items-center">
                <div className="flex flex-row w-full">
                    <h5 className="title m-2 pr-3 flex align-items-center justify-content-center">Property Details</h5>
                    <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="layout-breadcrumb p-pl-3 p-py-2 ml-auto" />
                </div>
            </div>
      <Card header={header} className="shadow-2">
        {Object.entries(fieldGroups).map(([groupName, group]) => {
          const hasData = group.fields.some((field) => complexData[field]);
          if (!hasData) return null;

          return (
            <div key={groupName} className="mb-4 p-3">
              <div className="flex align-items-center mb-3">
                <i className={`${group.icon} mr-2 text-primary text-xl`}></i>
                <span className="text-xl font-semibold text-900">{groupName}</span>
                <Divider layout="horizontal" className="flex-1 ml-3" />
              </div>
              <div className="grid">
                {group.fields.map((key) => {
                  if (!complexData[key]) return null;
                  return (
                    <div key={key} className="col-12 md:col-6 lg:col-4 mb-3">
                      <div className="surface-card p-3 border-round-xl h-full hover:surface-hover transition-colors transition-duration-150">
                        <div className="flex align-items-center mb-2">
                          <div className="w-2rem h-2rem flex align-items-center justify-content-center border-round bg-primary-50">
                            <i className={`${getIcon(key)} text-primary`}></i>
                          </div>
                          <span className="font-medium text-700 ml-2">
                            {key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                          </span>
                        </div>
                        <div className="mt-2 pl-3rem">
                          {formatValue(key, complexData[key])}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
};

export default SalesmanPropertyDetails;

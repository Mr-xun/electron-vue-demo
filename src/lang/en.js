export default {
    route: {
        dashboard: 'Dashboard',
        profile: 'Profile',
        noCheck:'Unreviewed order'
    },
    navbar: {
        setting: 'Settings',
        logOut: 'Log Out',
        profile: 'Profile',
        theme: 'Theme',
        size: 'Global Size',
        deleteCache: 'DeleteCache'
    },
    login: {
        title: 'DMS System Login',
        logIn: 'Login',
        username: 'Username',
        password: 'Password',
        code: 'Code',
        ortherLoginType: 'Orther login type',
        chooseToSignIn: 'Sign in with the following account: ',
        type: {
            up: 'Account Password',
            social: 'Third Party Account'
        }
    },
    documentation: {
        documentation: 'Documentation',
        github: 'Github Repository'
    },
    table: {
        user: {
            fullname:'FullName',
            username: 'UserName',
            password: 'Password',
            sex: 'Gender',
            email: 'Email',
            dept: 'Department',
            role: 'Role',
            mobile: 'Mobile',
            status: 'Status',
            createTime: 'CreateTime',
            modifyTime: 'ModifyTime',
            lastLoginTime: 'LastLoginTime',
            desc: 'Personal Description',
            oldPassword: 'Old Password',
            newPassword: 'New Password',
            confirmPassword: 'Confirm Again',
            social: 'Third Party Account',
            dataPermission: 'Data Permission',
            firstLetter: 'FirstLetter',
            baseOrganizationName: 'BaseOrganizationName',
            post: 'Post',
            description:'Description'
        },
        role: {
            roleName: 'RoleName',
            remark: 'Description',
            createTime: 'CreateTime',
            perms: 'Permissions'
        },
        menu: {
            parentId: 'Parent',
            menuName: 'Name',
            type: 'Type',
            icon: 'Icon',
            component: 'Component',
            path: 'URL',
            orderNum: 'Order',
            perms: 'Permissions'
        },
        dept: {
            deptName: 'DeptName',
            parentId: 'Parent',
            orderNum: 'Order'
        },
        client: {
            clientId: 'clientId',
            clientSecret: 'clientSecret',
            scope: 'scope',
            authorizedGrantTypes: 'authorizedGrantTypes',
            accessTokenValidity: 'accessTokenValidity',
            refreshTokenValidity: 'refreshTokenValidity',
            webServerRedirectUri: 'webServerRedirectUri',
            autoapprove: 'autoapprove'
        },
        systemLog: {
            username: 'UserName',
            operation: 'Description',
            createTime: 'CreateTime',
            time: 'Duration',
            method: 'Method',
            params: 'parameter',
            ip: 'IP',
            location: 'Location'
        },
        loginLog: {
            username: 'UserName',
            loginTime: 'LoginTime',
            ip: 'IP',
            location: 'Location',
            system: 'System',
            browser: 'Browser'
        },
        basic: {
            basePlatform: {
                organizationId: 'Organizate',
                Name: 'PlatformName',
                Code: 'PlatformCode',
                Appkey: 'Appkey',
                Token: 'Token',
                storeid: 'Store',
                plantformuserid: 'PlantformUser',
                productuserid: 'ProductUser',
                productstatus: 'ProductStatus',
                pricestatus: 'PriceStatus',
                stockstatus: 'StockStatus',
                orderstatus: 'OrderStatus'
            },
            baseStore: {
                code: 'BaseStoreCode',
                name: 'BaseStoreName',
                abbreviation: 'Abbreviation',
                address: 'Address',
                addressarea: 'AddressArea',
                area: 'Area',
                city: 'City',
                prov: 'Province ',
                sender: 'SenderID',
                senderName: 'SenderName',
                senderPhone: 'SenderPhone',
                userid: 'PrincipalID',
                userName: 'PrincipalName',
                firstLetter: 'FirstLetter',
                orgId: 'OrganizeID',
                orgName: 'OrganizeName'
            },
            baseHospital: {
                name: 'HospitalName',
                code: 'HospitalCode'
            },
            baseDoctor: {
                name: 'Name',
                sex: 'Sex',
                brithday: 'DateBirth',
                phone: 'Phone',
                hospital: 'Hospital',
                chooseHospital: 'ChooseHospital'
            },
            baseOnlineProduct: {
                name: 'ProductName',
                approvalNo: 'ApprovalNo',
                baseOrganizationId: 'Organizate',
                baseProductId: 'BaseProduct',
                brcode: 'Brcode',
                chemicalName: 'ChemicalName',
                code: 'Code',
                commonLetterF: 'CommonNameFirsterLetter',
                commonName: 'CommonName',
                conversionRate: 'ConversionRate',
                drugsState: 'DrugsState',
                erpCode: 'ERPCode',
                largeunit: 'LargUnit',
                letterF: 'ProductNameFirstletter',
                operateUserid: 'OperateUser',
                platformId: 'Platform',
                prescription: 'Prescription',
                properties: 'Properties',
                protype: 'ProductType',
                purchaseUserid: 'PurchaseUser',
                cclassification: 'CclassiFication',
                retailPrice: 'RetailPrice',
                setMealCode: 'SetMealCode',
                setMealPrice: 'SetMealPrice',
                setmealName: 'SetmealName',
                specifications: 'Specifications',
                status: 'Status',
                storeid: 'StoreID',
                storeName: 'StoreName',

                unit: 'Unit',
                vendor: 'Vendor',
                drugsStatedes: {
                    a: 'Yes',
                    b: 'No'
                },
                statusdes: {
                    a: 'Enabled',
                    b: 'Disabled'
                },
                protypedes: {
                    a: 'Standard',
                    b: 'Combo'
                }

            },
            baseProduct: {
                baseInfo: 'Basic Info',
                goodsPic: 'Product Design',
                usageDosage: 'Usage And Dosage',
                condition: 'Name/LetterF/Brcode/Vendor',
                code: 'Code',
                erpCode: 'ERPCode',
                name: 'ProductName',
                commonName: 'CommonName',
                chemicalName: 'ChemicalName',
                letterF: 'LetterF',
                commonLetterF: 'CommonLetterF',
                specifications: 'Specifications',
                unit: 'Unit',
                vendor: 'Vendor',
                brcode: 'Brcode',
                approvalNo: 'ApprovalNo',
                largeUnit: 'LargeUnit',
                properties: 'Properties',
                drugsState: 'DrugsState',
                drugsStatedes: {
                    a: 'YES',
                    b: 'NO'
                },
                prescription: 'PrescriptionID',
                prescriptionName: 'Prescription',
                storeid: 'StoreId',
                storeName: 'StoreName',
                cclassification: 'Cclassification',
                retailprice: 'RetailPrice'
            },
            baseProducdosage: {
                productId: 'Product',
                dosageId: 'Dosage',
                dosageName: 'DosageName',
                useLevel: 'UseLevel',
                medicationDays: 'MedicationDays',
                id: 'Id'
            },
            baseMsgConfig: {
                appcode: 'AppCode',
                appkey: 'Appkey',
                appsecret: 'AppSecret',
                baseOrganizationId: 'BaseOrganizationId',
                orgName: 'OrgName',
                id: 'ID',
                name: 'Name',
                qty: 'Qty'
            }
        },
        order: {
            submitOrder: 'Submit Order',
            modify:'Modify Order',
            total: 'Total',
            orderType: {
                toAudit: 'ToAudit',
                toSend: 'ToSend',
                shipped: 'Shipped',
                canceled:'Canceled',
                haveToReturn: 'HaveToReturn'
            },
            addOrder: {
                joinOrder: 'Add Order',
                addProduct: 'Add Product',
                addPackage: 'Add Package',
                printExpressOrder: 'Print Express Order',
                printOutListOrder: 'Print OutList Order',
                scanBarcode: 'Scan Barcode',
                orderCode: 'OrderCode',
                createTime: 'CreateTime',
                revisitTime: 'RevisitTime',
                revisitState: 'RevisitState',
                revisitRecord: 'RevisitRecord',
                smsState: 'SmsState',
                needRevisit: 'Revisit',
                noRevisit: 'NoRevisit',
                needSendMsg: 'SendMsg',
                noSendMsg: 'NoSendMsg',
                deliveryTime: 'DeliveryTime',
                receiveArea: 'ReceiveArea',
                address: 'Address',
                clientName: 'ClientName',
                mobile: 'Mobile',
                phone: 'Phone',
                hospitalId: 'HospitalID',
                hospitalName: 'HospitalName',
                doctorId: 'DoctorId',
                doctorName: 'DoctorName',
                storeId: 'StoreID',
                storeName: 'StoreName',
                shipperId: 'ShipperID',
                shipperName: 'ShipperName',
                orgId: 'OrgID',
                orgName: 'OrgName',
                logisticCode: 'LogisticCode',
                auditorId: 'AuditorID',
                auditorName: 'AuditorName',
                orderWay: 'OrderWay',
                paytypeId: 'PayTypeId',
                paytype: 'PayType',
                deliveryType: 'DeliveryType',
                freightPayType: 'FreightPayType',
                freightWePayType: 'WePay',
                freightClientPay: 'CustomerPay',
                bookCode: 'BookCode',
                customerService: 'CustomerServiceID',
                customerServiceName: 'CustomerServiceName',
                orderType: 'OrderType',
                remark: 'Remark',
                serialNumber: 'SerialNumber',
                picture: 'Picture',
                productName: 'ProductName',
                productCode: 'ProductCode',
                unit: 'Unit',
                specifications: 'Specifications',
                dosageId: 'DosageID',
                dosageName: 'DosageName',
                useLevelId: 'UseLevelID',
                useLevelName: 'UseLevelName',
                medicationDays: 'MedicationDays',
                vendor: 'Vendor',
                number: 'Counter',
                price: 'Price',
                costPrice: 'CostPrice',
                retailPrice: 'RetailPrice',
                expressFee: 'ExpressFee',
                discountAmount: 'DiscountAmount',
                amount: 'Amount',
                procedureFee: 'ProcedureFee',
                payment: 'PayMent',
                goLook: 'GoLook',
                stayAddPage: 'StayCurrentPage',
                createFinish: 'Order Creation Completed',
                updateFinish: 'Order Updation Completed'
            },
            saleOrder: {
                joinOrder: 'Add Order',
                addProduct: 'Add Product',
                addPackage: 'Add Package',
                printExpressOrder: 'Print Express Order',
                printOutListOrder: 'Print OutList Order',
                scanBarcode: 'Scan Barcode',
                orderCode: 'OrderCode',
                createTime: 'CreateTime',
                revisitTime: 'RevisitTime',
                revisitState: 'RevisitState',
                revisitRecord: 'RevisitRecord',
                smsState: 'SmsState',
                needRevisit: 'Revisit',
                noRevisit: 'NoRevisit',
                needSendMsg: 'SendMsg',
                noSendMsg: 'NoSendMsg',
                deliveryTime: 'DeliveryTime',
                receiveArea: 'ReceiveArea',
                address: 'Address',
                prov: 'Prov',
                city: 'City',
                area: 'Area',
                clientName: 'ClientName',
                mobile: 'Mobile',
                phone: 'Phone',
                hospitalId: 'HospitalID',
                hospitalName: 'HospitalName',
                doctorId: 'DoctorId',
                doctorName: 'DoctorName',
                storeId: 'StoreID',
                storeName: 'StoreName',
                shipperId: 'ShipperID',
                shipperName: 'ShipperName',
                orgId: 'OrgID',
                orgName: 'OrgName',
                logisticCode: 'LogisticCode',
                auditorId: 'AuditorID',
                auditorName: 'AuditorName',
                auditTime: 'AuditTime',

                orderWay: 'OrderWay',
                paytypeId: 'PayTypeId',
                paytype: 'PayType',
                deliveryType: 'DeliveryType',
                freightPayType: 'FreightPayType',
                freightWePayType: 'WePay',
                freightClientPay: 'CustomerPay',
                bookCode: 'BookCode',
                customerService: 'CustomerServiceID',
                customerServiceName: 'CustomerServiceName',
                orderType: 'OrderType',
                remark: 'Remark',
                serialNumber: 'SerialNumber',
                picture: 'Picture',
                productName: 'ProductName',
                productCode: 'ProductCode',
                unit: 'Unit',
                specifications: 'Specifications',
                dosageId: 'DosageID',
                dosageName: 'DosageName',
                useLevelId: 'UseLevelID',
                useLevelName: 'UseLevelName',
                medicationDays: 'MedicationDays',
                vendor: 'Vendor',
                number: 'Counter',
                price: 'Price',
                costPrice: 'CostPrice',
                retailPrice: 'RetailPrice',
                expressFee: 'ExpressFee',
                discountAmount: 'DiscountAmount',
                amount: 'Amount',
                procedureFee: 'ProcedureFee',
                payment: 'PayMent',
                expressBillState: 'ExpressBillState',
                expressBillTime: 'ExpressBillTime',
                invoiceState: 'InvoiceState',
                invoiceTime: 'InvoiceTime',
                logisticCode: 'LogisticCode',
                goLook: 'GoLook',
                stayAddPage: 'StayAddPage',
                ToAudit:'ToAudit',
                ToSendTheGoods:'ToSendTheGoods',
                HasBeenShipped:'HasBeenShipped',
                HasBeenCancelled:'HasBeenCancelled',
                HaveToReturn:'HaveToReturn'
            },
            checkOrder:{
                check:'audit',
                cancel:'cancel',
                modify:'modify',
                delivery:'delivery',
                details:'details'
            }
        },
        baseOrganization: {
            code: 'Code',
            name: 'Name',
            abbreviation: 'Abbreviation',
            firstLetter: 'FirstLetter',
            legalrepresentative: 'Legalrepresentative',
            registeredaddress: 'Registeredaddress',
            parentId: 'ParentId',
            userId: 'UserId'
        },
        baseShipper: {
            code: 'Code',
            name: 'Name',
            firstLetter: 'FirstLetter',
            kdniao_code: 'kdniao_code',
            kdniao_name: 'kdniao_name',
            jddj_code: 'jddj_code',
            jddj_name: 'jddj_name'
        },
        baseSalesman: {
            id: 'ID',
            name: 'Name',
            sex: 'Sex',
            brithday: 'Brithday',
            phone: 'Phone',
            product: 'Commodity information (support multiple commodity entry）',
            addProduct: 'New product',
            productId: 'ID',
            EPRCode: 'EPRCode',
            productCode: 'code',
            productName: 'name',
            doctor: 'Doctor information (support to enter multiple doctors)',
            addDoctor: 'New dovtor',
            doctorId: 'ID',
            doctorName: 'name',
            add: 'Add',
            sex: 'sex',
            parentId: 'parent ID',
            productSearch: 'Name/LetterF/Brcode/Vendor'
        },
        baseProducdosage: {
            productId: 'Product ID',
            name: 'Name',
            dosageId: 'Dosage ID',
            useLevel: 'Use Level',
            medicationDays: 'Medication Days',
            id: 'id'
        },
        baseProducpic: {
            productId: 'Product ID',
            picUrl: 'Pic Url',
            picType: 'Pic Type'
        },
        baseProduct: {
            code: 'Code',
            ERPCode: 'ERPCode',
            name: 'Name',
            commonName: 'CommonName',
            chemicalName: 'ChemicalName',
            letterF: 'LetterF',
            commonLetterF: 'CommonLetterF',
            specifications: 'Specifications',
            unit: 'Unit',
            vendor: 'Vendor',
            brcode: 'Brcode',
            approvalNo: 'ApprovalNo',
            largeunit: 'Largeunit',
            properties: 'Properties',
            drugsState: 'DrugsState',
            prescription: 'Prescription',
            storeid: 'StoreId',
            cclassification: 'Cclassification',
            retailprice: 'RetailPrice'
        },
        baseDiagnostic: {
            name: 'Name',
            id: 'ID',
            firstLetter: 'FirstLetter',
            drugList: 'Drug information (support multiple product entry)',
            add: 'New drugs',
            code: 'Code',
            productName: 'Name',
            specifications: 'Specifications',
            vendor: 'Vendor',
            brcode: 'Brcode',
            qtydesc: 'Qtydesc',
            warning: 'Can\'t choose repeatedly',
            drugListView: 'Drug information',
            productSearch: 'Name/LetterF/Brcode/Vendor'
        },
        baseEnum: {
            code: 'Code',
            name: 'Name',
            abbreviation: 'Abbreviation',
            enumType: 'EnumType',
            enumTypeName: 'EnumTypeName',
            delStatus: 'DelStatus'
        },
        memberinfo: {
            id: 'ID',
            name: 'Name',
            sex: 'Sex',
            brithday: 'Brithday',
            telPhone: 'telPhone',
            phone: 'phone',
            address: 'Address',
            membertype: 'Member Type',
            userid: 'User ID',
            userName: 'User Name',

            receiveArea: 'ReceiveArea',
            orgid: 'Org ID',
            source: 'Source',
            create_time: 'Create Time',
            update_time: 'Update Time',
            wechart: 'Wechart',
            allergic_history: 'Allergic History',
            remark: 'Remark',
            last_return_date: 'last return date',
            idcard_number: 'idcard Number',
            whether_msg: 'whether Msg',
            is: 'Yes',
            not: 'NO'
        },
        baseMsgRecord: {
            uid: 'uid',
            phone: 'Phone',
            msg: 'Msg',
            msgTimestamp: 'Msg Timestamp',
            extend: 'Extend',
            baseOrganizationId: 'Org Id',
            msgStatus: 'Msg Status',
            backMag: 'Desc',
            msgtype: 'Msg Type',
            createdate: 'createdate',
            appkey: 'Appkey',
            eport_time: 'eport Time'
        },
        gen: {
            config: {
                author: 'Author',
                basePackage: 'Base Package',
                entityPackage: 'Entity Package',
                mapperPackage: 'Mapper Package',
                mapperXmlPackage: 'Mapper Xml Package',
                servicePackage: 'Service Package',
                serviceImplPackage: 'ServiceImpl Package',
                controllerPackage: 'Controller Package',
                isTrim: 'Trim Prefix',
                trimValue: 'Trim Value'
            },
            generate: {
                tableName: 'TableName',
                remark: 'Remark',
                dataRows: 'DataRows',
                createTime: 'CreateTime',
                updateTime: 'UpdateTime',
                datasource: 'DataSource'
            }
        },
        job: {
            beanName: 'BeanName',
            methodName: 'MethodName',
            params: 'Params',
            cronExpression: 'CronExpression',
            status: 'Status',
            createTime: 'CreateTime',
            executeTime: 'ExecuteTime',
            error: 'Error',
            time: 'Duration',
            remark: 'Remark',
            add: 'Create',
            delete: 'Delete',
            resume: 'Resume',
            pause: 'Pause',
            run: 'Run once',
            fail: 'Fail',
            success: 'Success',
            normal: 'Normal'
        },
        eximport: {
            field1: 'Field 1',
            field2: 'Field 2',
            field3: 'Field 3',
            createTime: 'Import Time'
        },
        datapermissionTest: {
            field1: 'Field 1',
            field2: 'Field 2',
            field3: 'Field 3',
            field4: 'Field 4',
            createTime: 'CreateTime',
            tips: 'Data permission test, different users see different data'
        },
        routeUser: {
            tips:
				'Gateway management user account list, permissions are divided into ordinary users (user) and administrative users (admin)',
            username: 'UserName',
            perm: 'Permissions',
            createTime: 'CreateTime',
            password: 'Password'
        },
        routeLog: {
            tips:
				'Gateway forwards request logs. These are requests that have not been intercepted by traffic limiting or blacklisting rules.',
            ip: 'Request IP',
            targetServer: 'Target Server',
            requestMethod: 'Request Method',
            requestTime: 'Request Time',
            requestUri: 'Request URI',
            targetUri: 'Target URI',
            location: 'Location'
        },
        rateLimitRule: {
            tips:
				'Define gateway traffic restriction rules. Requests that do not meet the rules will be intercepted. The interception records can be viewed through the traffic restriction log.',
            requestUri: 'Request URI',
            requestMethod: 'Request Method',
            limitFrom: 'Limit From',
            allTheTime: 'all the time',
            limitTo: 'Limit To',
            count: 'Count',
            period: 'Period (Seconds)',
            createTime: 'CreateTime',
            nst: 'Wildcards are not supported',
            status: 'Status',
            timeLimit: 'Time Limit',
            timeRange: 'Time Range'
        },
        rateLimitLog: {
            tips: 'Show request logs intercepted by traffic limiting rules',
            requestUri: 'Request URI',
            requestMethod: 'Request Method',
            createTime: 'Request Time',
            ip: 'Request IP',
            location: 'Location'
        },
        blackList: {
            tips: 'Define gateway request blacklist',
            requestUri: 'Request URI',
            requestMethod: 'Request Method',
            createTime: 'CreateTime',
            ip: 'Request IP',
            location: 'Location',
            allIp: 'unlimited IP',
            limitFrom: 'Limit From',
            allTheTime: 'all the time',
            limitTo: 'Limit To',
            status: 'Status',
            st: 'Wildcard support',
            timeLimit: 'Time Limit',
            timeRange: 'Time Range'
        },
        blockLog: {
            tips:
				'Support wildcards to display request logs intercepted by blacklist rules. Requests that do not meet the rules will be intercepted. The interception records can be viewed through the blacklist logs.',
            requestUri: 'Request URI',
            requestMethod: 'Request Method',
            createTime: 'Request Time',
            ip: 'Request IP',
            location: 'Location'
        },
        routeLogin: {
            needLogin: 'The operation of the gateway management module requires authentication, ',
            toLogin: ' Click to login',
            tips:
				'The function of this module needs to be enhanced in advance. For the method of opening, please refer to the document: ',
            title: 'DMS Gateway Certification',
            login: 'Login'
        },
        refresh: 'Refresh',
        operation: 'Operation',
        search: 'Search',
        searchCondition: 'Condition',
        reset: 'Reset',
        more: 'More',
        add: 'Add',
        export: 'Export',
        import: 'Import',
        templateDownload: 'Template Download',
        delete: 'Delete',
        resetPassword: 'RestPassword',
        openInNewPage: 'New Page'
    },
    tagsView: {
        refresh: 'Refresh',
        close: 'Close',
        closeOthers: 'Close Others',
        closeAll: 'Close All'
    },
    settings: {
        title: 'Page style setting',
        theme: 'Theme Color',
        tagsView: 'Open Tags-View',
        fixedHeader: 'Fixed Header',
        sidebarLogo: 'Sidebar Logo'
    },
    system: {
        title: 'DMS System'
    },
    tips: {
        usernameShouldNotBeEmpty: 'Username can not be empty',
        passwordShouldNotBeEmpty: 'Password can not be empty',
        switchLanguageSuccess: 'Switch language successfully',
        loginSuccess: 'Login successful',
        loginFail: 'Login failed',
        defaultPassword: 'The user\'s default password is 1234qwer',
        getDataFail: 'Failed to get data',
        createSuccess: 'Create successfully',
        updateSuccess: 'Update successfully',
        deleteSuccess: 'Delete successfully',
        checkSuccess: 'Check successfully',
        sendSuccess:'Successful delivery',
        cancelSuccess:'Cancelled successfully',
        noDataSelected: 'No data selected yet',
        confirmDelete: 'The selected data will be permanently deleted, continue?',
        confirmDeleteCache: 'Whether to clear the user permission cache immediately?',
        containCurrentUser: 'The operation has been canceled because it contains the currently logged in user',
        neverLogin: 'Never logged in to the DMS system',
        nothing: 'Nothing',
        topId: 'A value of 0 indicates a top-level node',
        choose: 'Select: ',
        chooseNothing: 'No icons have been selected yet',
        onlyChooseOne: 'Only one node can be selected as the parent node',
        noNodeSelected: 'Please select a node first',
        confirmDeleteNode: 'The selected node and its child nodes will be permanently deleted. Continue?',
        confirmLeaveRoute: 'Check that your current page has changed. Are you sure to leave?',

        confirmLookOrder: 'The order has been operated successfully. Do you want to look it?',
        confirmCheckOrder: 'The order has been operated successfully. Do you want to look it?',
        iframeGrant: 'Userame: ZKTW Password: 123456',
        notEqual: 'Inconsistent values entered twice',
        oldPasswordIncorrect: 'Old password incorrect',
        uploadSuccess: 'Upload Successfully',
        uploadFailed: 'Upload failed',
        onlySupportXlsx: 'Only supports Xlsx type files',
        updating: 'Updating',
        updateFailed: 'Update failed',
        noPermission: 'No permission',
        confirmRestPassword: 'Make sure to reset the selected user password?',
        resetPasswordSuccess: 'The selected user password reset has been reset to 1234qwer',
        getCodeImageFailed: 'Failed to get image verification code',
        tooManyRequest: 'Getting the authentication code is too frequent. Please try again later',
        clientOriginSecret: 'The original password of the client is: ',
        sameRule: 'The same rule already exists',
        createTips: 'Please fill in the relevant information in the form',
        cronInvalid: 'Cron expression is invalid',
        executeSuccess: 'Success',
        executeFail: 'Fail',
        confirmCheck: 'The selected data will be examination passed, continue?',
        confirmSend:'Selected data will be shipped, do you want to continue?',
        confirmCancel:'The selected data will be cancelled. Do you want to continue?'
    },
    rules: {
        require: 'Can\'t be empty',
        range2to10: '2 to 10 characters in length',
        range3to10: '3 to 10 characters in length',
        range3to20: '3 to 20 characters in length',
        range4to10: '4 to 10 characters in length',
        range6to20: '6 to 20 characters in length',
        code0to20: 'The number should be less than or equal to 20',
        isNumber: 'Please enter a numeric value',
        email: 'Email is invalid',
        mobile: 'Phone number is invalid',
        usernameExist: 'The username already exists',
        clientIdExist: 'The clientId already exists',
        roleNameExist: 'The role name already exists',
        noMoreThan10: 'Can\'t exceed 10 characters in length',
        noMoreThan11: 'Can\'t exceed 11 characters in length',
        noMoreThan20: 'Can\'t exceed 20 characters in length',
        noMoreThan50: 'Can\'t exceed 50 characters in length',
        noMoreThan100: 'Can\'t exceed 100 characters in length',
        invalidInteger: 'Please enter an integer greater than zero',
        invalidURL: 'URL is invalid'
    },
    common: {
        system: 'Microservice Auth System',
        desc: {
            a: 'Based on Spring Boot 2.2.0 & Spring Cloud Hoxton.RELEASE',
            b: 'Use Spring Cloud OAuth2 Unified Authentication',
            c: 'Authentication server resource server separation, easy to expand',
            d: 'Front-end separation architecture for increased efficiency',
            e: 'Integrate multiple monitoring to escort microservices',
            f: 'Provide detailed documentation and teach you how to build it',
            g: 'Build a highly available microservices cluster by K8S',
            h: 'Integrated RocketMQ, TX-LCN, Seata distributed transaction control',
            i: 'Data permissions, social login...'
        },
        view: 'Detail',
        tips: 'Tips',
        clear: 'Clear',
        confirm: 'Confirm',
        cancel: 'Cancel',
        add: 'Create',
        edit: 'Modify',
        username: 'User Name',
        dept: 'Department',
        createTime: 'Create Time',
        yes: 'Yes',
        no: 'No',
        open: 'Open',
        close: 'Close',
        sex: {
            male: 'Male',
            female: 'Female',
            secret: 'Secret'
        },
        status: {
            valid: 'Valid',
            invalid: 'Invalid'
        },
        menu: {
            menu: 'Menu',
            button: 'Button'
        },
        tab: {
            common: 'Common',
            directivity: 'Directivity',
            solid: 'Solid',
            food: 'Food'
        },
        aboutMe: 'About Me',
        changeAvatar: 'Change',
        lastLoginTime: 'Last login time',
        goodMorning: 'Good morning',
        goodAfternoon: 'Good afternoon',
        goodEvening: 'Good evening',
        randomMessage: {
            a: 'Have a coffee break☕',
            b: 'Do you want to play LOL with your friends?',
            c: 'How many bugs🐞 did you write today?',
            d: 'Have you chatted in the group today?',
            e: 'What delicious food did you eat today?',
            f: 'Have you smiled today?😊',
            g: 'Have you solved the problem for others today?',
            h: 'What are you going to eat?',
            i: 'Do you want to watch movies on weekends?'
        },
        allProject: 'All Projects',
        noDept: 'No department',
        noRole: 'No role',
        firstLogin: 'First login',
        todayIp: 'Today IP',
        todayVisit: 'Today visits',
        TotalVisit: 'Total visits',
        you: 'You',
        total: 'Total',
        visitTitle: 'Nearly ten days of system access records',
        timeline: 'Timeline',
        account: 'Account',
        password: 'Password',
        importResult: 'Import Result',
        hthz: 'Hou Tian Hanzi',
        al: 'Ali Style',
        lm: 'Lian Meng',
        ctc: 'Click to select',
        pleaseInputUrl: 'Please enter a URL',
        bind: 'Bind',
        unbind: 'Unbind',
        confirmUnbind: 'Make sure to unbind the third-party account?',
        unbindSuccess: 'Unbind successfully',
        bindSuccess: 'Bind successfully',
        bindLogin: 'Bind & Login',
        signLogin: 'Sign & Login',
        current: 'Current ',
        socialAccount: ' account ',
        socialTips:
			' haven\'t bound any system accounts yet, you can bind system accounts or register a new account and bind.'
    }
};

const { Client } = require('pg');

// PostgreSQL connection
const pgClient = new Client({
    user: 'your_pg_user',
    host: 'localhost',
    database: 'your_pg_database',
    password: 'your_pg_password',
    port: 5432,
});

pgClient.connect();

const createTables = async () => {
    try {
        // Create Orders table
        await pgClient.query(`
            CREATE TABLE IF NOT EXISTS Orders (
                id SERIAL PRIMARY KEY,
                actualDeliveryDate VARCHAR(255),
                adjustedSystemDistance VARCHAR(255),
                adminSupplier JSONB,
                amount VARCHAR(255),
                appliedForFreightPaymentAt BIGINT,
                awaitingSupplierBillingEntity BOOLEAN,
                BAUpdateCount INT,
                bill VARCHAR(255),
                billReason VARCHAR(255),
                billRemark VARCHAR(255),
                bills JSONB,
                billToAddress JSONB,
                billToWholeAddress VARCHAR(255),
                buyer JSONB,
                buyerAccountManager VARCHAR(255),
                buyerCreditNoteValue VARCHAR(255),
                buyerDeliveryTerms VARCHAR(255),
                buyerDueDate VARCHAR(255) NOT NULL,
                buyerId VARCHAR(255),
                buyerOrderAmount FLOAT,
                buyerOwner VARCHAR(255),
                buyerPaymentTerms VARCHAR(255) NOT NULL,
                buyerPaymentTermsOptions JSONB,
                buyerPOC JSONB,
                buyerPocName VARCHAR(255),
                buyerPONumber VARCHAR(255),
                buyerPrice VARCHAR(255),
                buyerTeamRemark VARCHAR(255),
                callLogs JSONB,
                cargoExchangeNotes JSONB,
                change_id UUID,
                childOrderData JSONB,
                coaRequired BOOLEAN,
                companyGST VARCHAR(255) NOT NULL,
                createdAt BIGINT NOT NULL,
                createdAtString VARCHAR(255),
                createdBy VARCHAR(255),
                creditNotes JSONB,
                creditNoteValue FLOAT,
                customerNotes VARCHAR(255),
                cxTripId VARCHAR(255),
                DAUpdateCount INT,
                DDEditCount INT,
                delay VARCHAR(255),
                deliveredTo VARCHAR(255),
                deliveredToDisplayName VARCHAR(255),
                deliveredToId VARCHAR(255),
                deliveredToWithParent VARCHAR(255),
                deliveryAddress JSONB,
                deliveryBuyerPaymentTerms VARCHAR(255),
                deliveryWholeAddress VARCHAR(255),
                detentionCharges JSONB,
                disableMessages BOOLEAN,
                disableOrderDueNotification BOOLEAN,
                dispatchDate VARCHAR(255) NOT NULL,
                dispatchDateUnix BIGINT,
                displayStatus VARCHAR(255),
                driverCoordinatorEmail VARCHAR(255),
                driverCoordinatorName VARCHAR(255),
                driverMobileNo VARCHAR(255),
                driverRemarks VARCHAR(255),
                dueDate VARCHAR(255) NOT NULL,
                ewaybillExpiryDate VARCHAR(255),
                ewaybillNumber VARCHAR(255),
                expectedDeliveryDate VARCHAR(255),
                freight VARCHAR(255),
                freightBillStatus VARCHAR(255),
                freightPayment VARCHAR(255) NOT NULL,
                freightPaymentApplicationDetails JSONB,
                freightPaymentApplicationStatus VARCHAR(255),
                freightPODStatus VARCHAR(255),
                freightQuotesCount INT,
                fromLocationsOfConfirmedTransporter INT,
                FY21GreaterThan10Cr VARCHAR(255),
                FY23GreaterThan10Cr VARCHAR(255),
                fy23GT10Cr VARCHAR(255),
                FY24GreaterThan10Cr VARCHAR(255),
                godown VARCHAR(255),
                godownDisplayName VARCHAR(255),
                godownId VARCHAR(255) NOT NULL,
                godownWithParent VARCHAR(255),
                gradeGroup VARCHAR(255),
                groupStateOwner VARCHAR(255) NOT NULL,
                highPriorityRemark VARCHAR(255),
                informBuyerOfDispatchDelay BOOLEAN,
                informDispatchDelay BOOLEAN,
                informSupplierOfDispatchDelay BOOLEAN,
                informTransporterOfDispatchDelay BOOLEAN,
                invoice VARCHAR(255),
                invoiceBalance VARCHAR(255),
                invoiceDatesDifferent BOOLEAN,
                invoiceDueDays VARCHAR(255),
                invoiceReceived BOOLEAN,
                invoiceStatus VARCHAR(255),
                invoiceValue VARCHAR(255),
                isEwayBillCreated VARCHAR(255),
                isLowestFreightSelected BOOLEAN,
                isOROnHold BOOLEAN,
                isPendingLimit VARCHAR(255),
                isReturn VARCHAR(255),
                isSplit BOOLEAN,
                issues JSONB,
                isSupplierInvoiceReminderSent BOOLEAN,
                L1Remarks JSONB,
                lastFreight VARCHAR(255),
                lastTransporterDetails JSONB,
                limitOptions JSONB,
                loadingAddress JSONB,
                loadingWholeAddress VARCHAR(255),
                logisticDelay VARCHAR(255),
                logisticDispatchDate VARCHAR(255),
                logisticTeamRemark VARCHAR(255),
                lowestFreightQuote VARCHAR(255),
                lrNo VARCHAR(255),
                lrReason VARCHAR(255),
                lrRemark VARCHAR(255),
                lrStatus VARCHAR(255),
                lrUploadedAt BIGINT,
                mappedTransporters INT,
                margin VARCHAR(255),
                materialIssues JSONB,
                maxPossibleFreight VARCHAR(255),
                meta JSONB,
                multiBuyers JSONB,
                no VARCHAR(255),
                orderDetails VARCHAR(255),
                orderedFrom VARCHAR(255) NOT NULL,
                orderHoldBy VARCHAR(255),
                orderHoldRemark VARCHAR(255),
                orderNo VARCHAR(255) NOT NULL,
                orderRequestId VARCHAR(255),
                orderUnHoldBy VARCHAR(255),
                orderUnHoldRemark VARCHAR(255),
                originalCombinedQuantity VARCHAR(255),
                originalDispatchDate VARCHAR(255),
                originalOrder JSONB,
                originalStatus VARCHAR(255),
                overdueAmount VARCHAR(255),
                parent VARCHAR(255),
                paymentMadeToSupplier BOOLEAN NOT NULL,
                paymentRecieved BOOLEAN,
                podReason VARCHAR(255),
                podRemark VARCHAR(255),
                preAdvanceRemarks VARCHAR(255),
                previousOrdersForThisRoute INT,
                priority VARCHAR(255),
                product JSONB,
                productId VARCHAR(255),
                productName VARCHAR(255),
                proformaInvoiceId VARCHAR(255),
                purchaseBill VARCHAR(255),
                purchaseOrderId VARCHAR(255),
                purchaseorderId VARCHAR(255),
                purchaseOrderNo VARCHAR(255),
                putOnHoldBy VARCHAR(255),
                quantity VARCHAR(255) NOT NULL,
                queryString VARCHAR(255),
                reapplyReason VARCHAR(255),
                reasonYNotStrTransporter VARCHAR(255),
                rejectionReason VARCHAR(255),
                rejectionReasons JSONB,
                rejectionRemarks JSONB,
                resetLogisticDD BOOLEAN,
                returnOrderCreatedFrom VARCHAR(255),
                selectedPaymentOption JSONB,
                showLimitOptions JSONB,
                singleQuantity VARCHAR(255) NOT NULL,
                slackPermaLink VARCHAR(255),
                slackThreadTimeStamp VARCHAR(255),
                ssurisha JSONB,
                status VARCHAR(255) NOT NULL,
                statusBeforeHold VARCHAR(255),
                statusLog JSONB,
                strongTransporters VARCHAR(255),
                strongTransportersFreight VARCHAR(255),
                strongTransportersMapped INT,
                strongTransportersQuoted INT,
                subType VARCHAR(255),
                supplier JSONB,
                supplierAccountManager VARCHAR(255),
                supplierCreditNoteValue VARCHAR(255),
                supplierDeliveryTerms VARCHAR(255),
                supplierDueDate VARCHAR(255),
                supplierId VARCHAR(255) NOT NULL,
                supplierOwner VARCHAR(255),
                supplierPaymentTerms VARCHAR(255),
                supplierPoc VARCHAR(255),
                supplierPocName VARCHAR(255),
                supplierPrice VARCHAR(255),
                supplierRegion VARCHAR(255),
                supplierTeamRemark VARCHAR(255),
                sysFreight FLOAT,
                sysMsgIds JSONB,
                systemFreight FLOAT,
                tags JSONB,
                trackingLink VARCHAR(255),
                trackingStatus VARCHAR(255),
                transitDays INT,
                transitDistance VARCHAR(255),
                transportAddress VARCHAR(255),
                transportEnquiryRemarks VARCHAR(255),
                transporter JSONB,
                transporterBillRefNo VARCHAR(255),
                transporterConfirmedAt BIGINT,
                transporterDebitInvoiceId VARCHAR(255),
                transporterId VARCHAR(255),
                transporterRemarks VARCHAR(255),
                transportersQuoted INT,
                transportRegion VARCHAR(255),
                type VARCHAR(255) NOT NULL,
                updatedAt BIGINT NOT NULL,
                updates JSONB,
                utrNo JSONB,
                vehicleLoadedAt BIGINT,
                vehicleNo VARCHAR(255),
                zcrmId VARCHAR(255)
            );
        `);

        // Create VendorCredits table
        await pgClient.query(`
            CREATE TABLE IF NOT EXISTS VendorCredits (
                id SERIAL PRIMARY KEY,
                order_id INT REFERENCES Orders(id),
                data JSONB
            );
        `);

        // Create ActivityLog table
        await pgClient.query(`
            CREATE TABLE IF NOT EXISTS ActivityLog (
                id SERIAL PRIMARY KEY,
                order_id INT REFERENCES Orders(id),
                data JSONB
            );
        `);

        // Create Notes table
        await pgClient.query(`
            CREATE TABLE IF NOT EXISTS Notes (
                id SERIAL PRIMARY KEY,
                order_id INT REFERENCES Orders(id),
                BCNChangeRemark VARCHAR(255),
                BPChangeRemark VARCHAR(255),
                BPTChangeRemark VARCHAR(255),
                deliveredToChangeRemark VARCHAR(255),
                qtyChangeRemark VARCHAR(255),
                SCNChangeRemark VARCHAR(255),
                SPChangeRemark VARCHAR(255)
            );
        `);

        // Create Invoices table
        await pgClient.query(`
            CREATE TABLE IF NOT EXISTS Invoices (
                id SERIAL PRIMARY KEY,
                order_id INT REFERENCES Orders(id),
                invoice VARCHAR(255),
                invoiceBalance VARCHAR(255),
                invoiceDatesDifferent BOOLEAN,
                invoiceDueDays VARCHAR(255),
                invoiceReceived BOOLEAN,
                invoiceStatus VARCHAR(255),
                invoiceValue VARCHAR(255)
            );
        `);

        // Create DelayReasons table
        await pgClient.query(`
            CREATE TABLE IF NOT EXISTS DelayReasons (
                id SERIAL PRIMARY KEY,
                order_id INT REFERENCES Orders(id),
                dispatchDate VARCHAR(255) NOT NULL,
                remarks VARCHAR(255) NOT NULL,
                type VARCHAR(255) NOT NULL
            );
        `);

        // Create Attachments table
        await pgClient.query(`
            CREATE TABLE IF NOT EXISTS Attachments (
                id SERIAL PRIMARY KEY,
                order_id INT REFERENCES Orders(id),
                created BIGINT NOT NULL,
                isAutoGenerated BOOLEAN,
                name VARCHAR(255) NOT NULL,
                remark VARCHAR(255),
                source VARCHAR(255) NOT NULL,
                type VARCHAR(255) NOT NULL,
                url VARCHAR(255),
                user JSONB,
                userProfile VARCHAR(255)
            );
        `);

        console.log('Tables created successfully!');
    } catch (err) {
        console.error('Error creating tables', err.stack);
    } finally {
        pgClient.end();
    }
};

createTables();

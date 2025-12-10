import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class RdsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create VPC
        const vpc = new ec2.Vpc(this, 'VPC', {
            maxAzs: 2,
            natGateways: 1,
        });

        // Security group
        const securityGroup = new ec2.SecurityGroup(this, 'DatabaseSecurityGroup', {
            vpc,
            description: 'Allow access to the database',
            allowAllOutbound: true,
        });

        securityGroup.addIngressRule(
            ec2.Peer.ipv4(vpc.vpcCidrBlock),
            ec2.Port.tcp(5432),
            'Allow Postgres access from within VPC',
        );

        const isProduction = process.env.CDK_ENV === 'prod';
        // RDS PostgreSQL
        const dbInstance = new rds.DatabaseInstance(this, 'Database', {
            engine: rds.DatabaseInstanceEngine.postgres({
                version: rds.PostgresEngineVersion.VER_16,
            }),
            vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
            },
            securityGroups: [securityGroup],
            allocatedStorage: 20,
            maxAllocatedStorage: 100,
            publiclyAccessible: false,
            storageType: rds.StorageType.GP2,
            backupRetention: cdk.Duration.days(7),
            deletionProtection: isProduction,
            multiAz: isProduction,
            instanceType: new ec2.InstanceType('t3.micro'),
            credentials: rds.Credentials.fromGeneratedSecret('dbadmin'),
            databaseName: 'notiMailerDB',
            removalPolicy: isProduction ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
        });

        new cdk.CfnOutput(this, 'DatabaseSecretName', {
            value: dbInstance.secret!.secretName,
        });
    }
}

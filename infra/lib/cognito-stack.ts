import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';

export class CognitoStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const userPool = new cognito.UserPool(this, 'UserPool', {
            userPoolName: 'notiMailerUserPool',
            signInCaseSensitive: false,
            selfSignUpEnabled: true,

            userVerification: {
                emailSubject: 'Verify your email for notiMailer!',
                emailBody: `
Hello {username},  
Thanks for signing up to notiMailer!  
Click the link to verify your email:  
{##Verify Email##}
        `,
                emailStyle: cognito.VerificationEmailStyle.LINK,
            },

            signInAliases: { email: true, username: true },
            autoVerify: { email: true },
            signInPolicy: {
                allowedFirstAuthFactors: { password: true },
            },

            featurePlan: cognito.FeaturePlan.LITE,

            customAttributes: {
                company: new cognito.StringAttribute({ mutable: true }),
                createdAt: new cognito.DateTimeAttribute({ mutable: false }),
            },

            passwordPolicy: {
                minLength: 12,
                requireLowercase: true,
                requireUppercase: true,
                requireDigits: true,
                requireSymbols: false,
            },
            accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
        });

        new cdk.CfnOutput(this, 'UserPoolId', {
            value: userPool.userPoolId,
            description: 'The ID of the Cognito User Pool',
        });

        const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
            userPool,
            generateSecret: false,
            authFlows: {
                userPassword: true,
                userSrp: true,
            },
        });

        new cdk.CfnOutput(this, 'UserPoolClientId', {
            value: userPoolClient.userPoolClientId,
            description: 'The ID of the Cognito User Pool Client',
        });
    }
}

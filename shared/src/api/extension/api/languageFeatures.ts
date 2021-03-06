import { ProxyInput, ProxyResult, proxyValue } from '@sourcegraph/comlink'
import * as clientType from '@sourcegraph/extension-api-types'
import { Unsubscribable } from 'rxjs'
import {
    DefinitionProvider,
    DocumentSelector,
    HoverProvider,
    ImplementationProvider,
    Location,
    LocationProvider,
    ReferenceProvider,
    TypeDefinitionProvider,
} from 'sourcegraph'
import { ClientLanguageFeaturesAPI } from '../../client/api/languageFeatures'
import { ReferenceParams, TextDocumentPositionParams } from '../../protocol'
import { syncSubscription } from '../../util'
import { toProxyableSubscribable } from './common'
import { ExtDocuments } from './documents'
import { fromHover, fromLocation, toPosition } from './types'

/** @internal */
export class ExtLanguageFeatures {
    constructor(private proxy: ProxyResult<ClientLanguageFeaturesAPI>, private documents: ExtDocuments) {}

    public registerHoverProvider(selector: DocumentSelector, provider: HoverProvider): Unsubscribable {
        const providerFunction: ProxyInput<
            Parameters<ClientLanguageFeaturesAPI['$registerHoverProvider']>[1]
        > = proxyValue(async ({ textDocument, position }: TextDocumentPositionParams) =>
            toProxyableSubscribable(
                provider.provideHover(await this.documents.getSync(textDocument.uri), toPosition(position)),
                hover => (hover ? fromHover(hover) : hover)
            )
        )
        return syncSubscription(this.proxy.$registerHoverProvider(selector, providerFunction))
    }

    public registerDefinitionProvider(selector: DocumentSelector, provider: DefinitionProvider): Unsubscribable {
        const providerFunction: ProxyInput<
            Parameters<ClientLanguageFeaturesAPI['$registerDefinitionProvider']>[1]
        > = proxyValue(async ({ textDocument, position }: TextDocumentPositionParams) =>
            toProxyableSubscribable(
                provider.provideDefinition(await this.documents.getSync(textDocument.uri), toPosition(position)),
                toLocations
            )
        )
        return syncSubscription(this.proxy.$registerDefinitionProvider(selector, providerFunction))
    }

    public registerTypeDefinitionProvider(
        selector: DocumentSelector,
        provider: TypeDefinitionProvider
    ): Unsubscribable {
        const providerFunction: ProxyInput<
            Parameters<ClientLanguageFeaturesAPI['$registerTypeDefinitionProvider']>[1]
        > = proxyValue(async ({ textDocument, position }: TextDocumentPositionParams) =>
            toProxyableSubscribable(
                provider.provideTypeDefinition(await this.documents.getSync(textDocument.uri), toPosition(position)),
                toLocations
            )
        )
        return syncSubscription(this.proxy.$registerTypeDefinitionProvider(selector, providerFunction))
    }

    public registerImplementationProvider(
        selector: DocumentSelector,
        provider: ImplementationProvider
    ): Unsubscribable {
        return syncSubscription(
            this.proxy.$registerImplementationProvider(
                selector,
                proxyValue(async ({ textDocument, position }: TextDocumentPositionParams) =>
                    toProxyableSubscribable(
                        provider.provideImplementation(
                            await this.documents.getSync(textDocument.uri),
                            toPosition(position)
                        ),
                        toLocations
                    )
                )
            )
        )
    }

    public registerReferenceProvider(selector: DocumentSelector, provider: ReferenceProvider): Unsubscribable {
        const providerFunction: ProxyInput<
            Parameters<ClientLanguageFeaturesAPI['$registerReferenceProvider']>[1]
        > = proxyValue(async ({ textDocument, position, context }: ReferenceParams) =>
            toProxyableSubscribable(
                provider.provideReferences(
                    await this.documents.getSync(textDocument.uri),
                    toPosition(position),
                    context
                ),
                toLocations
            )
        )
        return syncSubscription(this.proxy.$registerReferenceProvider(selector, providerFunction))
    }

    public registerLocationProvider(
        idStr: string,
        selector: DocumentSelector,
        provider: LocationProvider
    ): Unsubscribable {
        const providerFunction: ProxyInput<
            Parameters<ClientLanguageFeaturesAPI['$registerLocationProvider']>[2]
        > = proxyValue(async ({ textDocument, position }: TextDocumentPositionParams) =>
            toProxyableSubscribable(
                provider.provideLocations(await this.documents.getSync(textDocument.uri), toPosition(position)),
                toLocations
            )
        )
        return syncSubscription(this.proxy.$registerLocationProvider(idStr, selector, proxyValue(providerFunction)))
    }
}

function toLocations(result: Location[] | Location | null | undefined): clientType.Location[] {
    return result ? (Array.isArray(result) ? result : [result]).map(location => fromLocation(location)) : []
}
